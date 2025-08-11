
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';

const PDF_DIR = path.join(process.cwd(), 'pdfs-to-convert');
const KB_DIR = path.join(process.cwd(), 'src', 'content', 'knowledge-base');

async function convertPdf(pdfPath: string) {
    const mdPath = path.join(KB_DIR, `${path.basename(pdfPath, '.pdf')}.md`);
    console.log(`Converting ${path.basename(pdfPath)}...`);
    try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = await pdf(dataBuffer);
        const mdContent = `# ${path.basename(pdfPath, '.pdf')}

${data.text}`;
        fs.writeFileSync(mdPath, mdContent, 'utf-8');
        console.log(`Converted ${path.basename(pdfPath)} to ${path.basename(mdPath)}`);
    } catch (error) {
        console.error(`Failed to convert ${path.basename(pdfPath)}:`, error);
    }
}

async function convertExistingPdfs() {
    const files = fs.readdirSync(PDF_DIR);
    for (const file of files) {
        if (file.endsWith('.pdf')) {
            await convertPdf(path.join(PDF_DIR, file));
        }
    }
}

function watchForNewPdfs() {
    fs.watch(PDF_DIR, async (eventType, filename) => {
        if (filename && eventType === 'rename' && filename.endsWith('.pdf')) {
            const pdfPath = path.join(PDF_DIR, filename);
            if (fs.existsSync(pdfPath)) {
                await convertPdf(pdfPath);
            }
        }
    });
    console.log(`Watching for new PDFs in: ${PDF_DIR}`);
}

async function main() {
    await convertExistingPdfs();
    watchForNewPdfs();
}

main().catch(console.error);
