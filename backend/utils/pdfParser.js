import fs from 'fs/promises';
import { PDFParse } from 'pdf-parse';

/**
 * Extract text content from a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<{text: string, numPages: number }>}
 */

export const extractTextFromFile = async (filePath) => {
    const dataBuffer = await fs.readFile(filePath);
    const parser = new PDFParse({ data: dataBuffer });

    try {
        const textResult = await parser.getText();
        const infoResult = await parser.getInfo().catch(() => ({ info: {}, metadata: {}, total: textResult?.total ?? 0 }));

        const text = textResult?.text || '';
        const numPages = textResult?.total ?? infoResult?.total ?? textResult?.pages?.length ?? 0;
        const info = infoResult?.info || {};
        const metadata = infoResult?.metadata || {};

        return { text, numPages, info, metadata };
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw new Error('Error extracting text from PDF');
    } finally {
        await parser.destroy().catch(() => {});
    }
};