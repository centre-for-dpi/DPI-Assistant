/**
 * PDF text extraction utilities
 */
import { pdf } from 'pdf-parse';

/**
 * Extract text content from a PDF buffer
 * @param buffer PDF file buffer
 * @returns Extracted text content
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(`Failed to extract text from PDF: ${error}`);
  }
}

/**
 * Check if a filename is a PDF
 * @param filename File name to check
 * @returns true if the file is a PDF
 */
export function isPDF(filename: string): boolean {
  return filename.toLowerCase().endsWith('.pdf');
}

/**
 * Check if a filename is a markdown file
 * @param filename File name to check
 * @returns true if the file is a markdown file
 */
export function isMarkdown(filename: string): boolean {
  return filename.toLowerCase().endsWith('.md');
}

/**
 * Check if a filename is a supported document type
 * @param filename File name to check
 * @returns true if the file type is supported
 */
export function isSupportedDocument(filename: string): boolean {
  return isMarkdown(filename) || isPDF(filename);
}
