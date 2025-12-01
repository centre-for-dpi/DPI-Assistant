/**
 * PDF text extraction utilities
 */

import * as canvas from 'canvas';

// Polyfill required canvas APIs for pdf-parse
if (!globalThis.DOMMatrix) {
  // @ts-ignore - Polyfill for pdf-parse
  globalThis.DOMMatrix = canvas.DOMMatrix;
}
if (!globalThis.ImageData) {
  // @ts-ignore - Polyfill for pdf-parse
  globalThis.ImageData = canvas.ImageData;
}
if (!globalThis.Path2D) {
  // @ts-ignore - Polyfill for pdf-parse
  globalThis.Path2D = canvas.Path2D;
}

/**
 * Extract text content from a PDF buffer
 * @param buffer PDF file buffer
 * @returns Extracted text content
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import for ESM module compatibility
    const { pdf } = await import('pdf-parse');

    // Extract text from PDF
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
