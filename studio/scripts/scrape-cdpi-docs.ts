
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';

const BASE_URL = 'https://docs.cdpi.dev';
const OUTPUT_PATH = path.join(process.cwd(), 'src', 'content', 'knowledge-base', 'cdpi-docs.md');
const MAX_PAGES = 100; // Safety limit to avoid infinite loops

const visited = new Set<string>();
const queue: string[] = [BASE_URL];
let allTextContent = `# Scraped Content from ${BASE_URL}\n\n`;
let pagesScraped = 0;

async function scrapePage(url: string) {
    if (visited.has(url) || pagesScraped >= MAX_PAGES) {
        return;
    }

    console.log(`Scraping (${pagesScraped + 1}/${MAX_PAGES}): ${url}`);
    visited.add(url);
    pagesScraped++;

    try {
        const response = await axios.get(url, { timeout: 15000 });
        const html = response.data;
        const $ = cheerio.load(html);

        // Find a suitable main content container
        const mainContentSelectors = [
            'main',
            'article',
            '.main-content',
            '[role="main"]'
        ].join(', ');

        let contentElement = $(mainContentSelectors).first();
        if (contentElement.length === 0) {
            contentElement = $('body'); // Fallback to body
        }
        
        // Remove non-content elements
        contentElement.find('nav, header, footer, aside, script, style, .toc, .sidebar, .edit-this-page').remove();

        const title = $('h1').first().text().trim();
        const pageText = contentElement.text();

        // Basic text cleaning
        const cleanedText = pageText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .join('\n');

        if (cleanedText) {
            allTextContent += `## Page: ${title || url}\n\n`;
            allTextContent += `*Source: [${url}](${url})*\n\n`;
            allTextContent += `${cleanedText}\n\n---\n\n`;
        }

        // Find and enqueue new links
        $('a').each((i, link) => {
            const href = $(link).attr('href');
            if (href) {
                try {
                    const absoluteUrl = new URL(href, BASE_URL).toString();
                    const urlObject = new URL(absoluteUrl);
                    
                    // Stay on the same domain and avoid non-html content
                    if (urlObject.hostname === new URL(BASE_URL).hostname && !visited.has(urlObject.href) && !queue.includes(urlObject.href)) {
                        if (!urlObject.pathname.match(/\.(pdf|zip|jpg|png|svg|json|xml)$/i)) {
                             // Remove hash from URL to avoid duplicate pages
                            const cleanUrl = urlObject.href.split('#')[0];
                            if(!visited.has(cleanUrl) && !queue.includes(cleanUrl)) {
                                queue.push(cleanUrl);
                            }
                        }
                    }
                } catch (e) {
                    // Ignore invalid URLs
                }
            }
        });

    } catch (error: any) {
        console.error(`Failed to scrape ${url}: ${error.message}`);
    }
}

async function main() {
    console.log('Starting recursive scrape of docs.cdpi.dev...');
    
    while (queue.length > 0 && pagesScraped < MAX_PAGES) {
        const urlToScrape = queue.shift();
        if (urlToScrape) {
            await scrapePage(urlToScrape);
            // Add a small delay to be respectful to the server
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    try {
        fs.writeFileSync(OUTPUT_PATH, allTextContent, 'utf-8');
        console.log(`\nScraping complete. Scraped ${pagesScraped} pages.`);
        console.log(`Content saved to: ${OUTPUT_PATH}`);
    } catch (error) {
        console.error(`Failed to write scraped content to file:`, error);
    }
    
    if (pagesScraped >= MAX_PAGES) {
        console.warn(`\nWarning: Reached maximum page limit of ${MAX_PAGES}. The scrape may be incomplete.`);
    }
}

main().catch(error => {
    console.error("An unhandled error occurred during the scraping process:", error);
});
