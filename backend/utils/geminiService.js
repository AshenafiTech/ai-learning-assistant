import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';


dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

if (!process.env.GEMINI_API_KEY) {
    console.warn('Warning: GEMINI_API_KEY is not set in environment variables.');
}

// Default to the same model used successfully for flashcards; override with GEMINI_MODEL_QUIZ if needed
const QUIZ_MODEL = process.env.GEMINI_MODEL_QUIZ || 'gemini-2.5-flash-lite';

/**
 * Generate Flashcards from text using Google Gemini AI
 * @param {string} text - Document text  
 * @param {number} count - Number of flashcards to generate
 * @returns {Promise<Array<{question: string, answer: string, difficulty: string}>>} - Returns a promise that resolves to an array of flashcards
 */
export const generateFlashcards = async (text, count = 10) => {
    const prompt = `Generate exactly ${count} educational flashcards
    from the following text.
    Format each flashcard as:
    Q: [Clear, specific question]
    A: [Concise, accurate answer]
    D: [Difficulty: easy, medium, or hard]

    Separate each flashcard with "---".
    Text:
    ${text.substring(0, 15000)}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        });

        const generatedText = response?.response?.text?.() || response?.text || '';

        // Parse the response into flashcards
        const flashcards = [];
        const cards = generatedText.split('---').map(c => c.trim()).filter(Boolean);

        for (const card of cards) {
            const lines = card.split('\n').map(l => l.trim()).filter(Boolean);
            let question = '', answer = '', difficulty = 'medium';

            for (const line of lines) {
                if (line.startsWith('Q:')) {
                    question = line.substring(2).trim();
                } else if (line.startsWith('A:')) {
                    answer = line.substring(2).trim();
                } else if (line.startsWith('D:')) {
                    const diff = line.substring(2).trim().toLowerCase();
                    if (['easy', 'medium', 'hard'].includes(diff)) {
                        difficulty = diff;
                    }
                }
            }

            if (question && answer) {
                flashcards.push({ question, answer, difficulty });
            }
        }

        return flashcards.slice(0, count);
    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to generate flashcards using Gemini AI');
    }
};

/**
 * Generate Quiz from text using Google Gemini AI
 * @param {string} text - Document text  
 * @param {number} numQuestions - Number of quiz questions to generate
 * @returns {Promise<Array<{question: string, options: Array, correctAnswer: string, explanation: string, difficulty: string}>>} - Returns a promise that resolves to an array of quiz questions
 */
export const generateQuiz = async (text, numQuestions = 5) => {
    const prompt = `Generate exactly ${numQuestions} multiple-choice questions (MCQs) from the following text.
Format each question exactly as:
Q: [question]
O1: [option 1]
O2: [option 2]
O3: [option 3]
O4: [option 4]
C: [exact correct option text]
E: [brief explanation]
D: [easy|medium|hard]
Separate each question with "---".

Text:
${text.substring(0, 15000)}`;

    try {
        const response = await ai.models.generateContent({
            model: QUIZ_MODEL,
            contents: prompt,
        });

        const generatedText = response?.response?.text?.() || response?.text || '';

        const questions = [];
        const questionBlocks = generatedText.split('---').map(q => q.trim()).filter(Boolean);

        for (const block of questionBlocks) {
            const lines = block.split('\n');
            let q = '', options = ['', '', '', ''], correctAnswer = '', explanation = '', difficulty = 'medium';

            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith('Q:')) {
                    q = trimmed.substring(2).trim();
                } else if (/^O[1-4]:/i.test(trimmed)) {
                    const idx = Number(trimmed[1]) - 1; // O1..O4
                    if (idx >= 0 && idx < 4) options[idx] = trimmed.substring(3).trim();
                } else if (trimmed.startsWith('C:')) {
                    correctAnswer = trimmed.substring(2).trim();
                } else if (trimmed.startsWith('E:')) {
                    explanation = trimmed.substring(2).trim();
                } else if (trimmed.startsWith('D:')) {
                    const diff = trimmed.substring(2).trim().toLowerCase();
                    if (['easy', 'medium', 'hard'].includes(diff)) difficulty = diff;
                } else if (/^[ABCD]:/.test(trimmed)) { // fallback A:/B:/C:/D:
                    const map = { A: 0, B: 1, C: 2, D: 3 };
                    const idx = map[trimmed[0]];
                    if (idx !== undefined) options[idx] = trimmed.substring(2).trim();
                } else if (trimmed.startsWith('Correct:')) { // fallback Correct:
                    const letter = trimmed.substring(8).trim().toUpperCase();
                    const map = { A: 0, B: 1, C: 2, D: 3 };
                    const idx = map[letter];
                    if (idx !== undefined) correctAnswer = options[idx];
                } else if (trimmed.startsWith('Explanation:')) { // fallback Explanation:
                    explanation = trimmed.substring('Explanation:'.length).trim();
                } else if (trimmed.startsWith('Difficulty:')) { // fallback Difficulty:
                    const diff = trimmed.substring('Difficulty:'.length).trim().toLowerCase();
                    if (['easy', 'medium', 'hard'].includes(diff)) difficulty = diff;
                }
            }

            if (q && options.every(o => o) && correctAnswer) {
                questions.push({ question: q, options, correctAnswer, explanation, difficulty });
            }
        }

        return questions.slice(0, numQuestions);
    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to generate quiz using Gemini AI');
    }
};

/**
 * Generate Summary from text using Google Gemini AI
 * @param {string} text - Document text  
 * @returns {Promise<string>} - Returns a promise that resolves to the summary text
 */
export const generateSummary = async (text) => {
    const prompt = `Provide a concise summary of the following text,
    highlighting the key concepts, main ideas, and important points.
    Keep the summary clear and easy to understand.
    
    Text:
    ${text.substring(0, 20000)}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        });

        const generatedText = response.text;
        return generatedText
    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to generate summary using Gemini AI');
    }

};

/**
 * Chat with document context
 * @param {string} question - User question 
 * @param {Array<Object>} chunks - Relevant document chunks
 * @returns {Promise<string>}
 */
export const chatWithContext = async (question, chunks) => {
    const context = chunks.map((c, i) => `[Chunk ${i + 1}]\n${c.content}`).join('\n\n');
    
    const prompt = `Based on the following context from a document, Analyze the context and answer the user's question accurately.
    If the answer is not in the context, say so.

    Context:
    ${context}

    Question:
    ${question}

    Answer:`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        });

        const generatedText = response.text;
        return generatedText
    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to generate chat response using Gemini AI');
    }
    
};

/**
 * Explain a specific concept from a document using Google Gemini AI
 * @param {string} concept - Concept to explain  
 * @param {string} context - Relevant context
 * @returns {Promise<string>}
 */
export const explainConcept = async (concept, context) => {
    const prompt = `Explain the following "${concept}" based on the following context.
    Provide a clear and concise explanation that's easy to understand.
    Include examples if relevant.

    Context:
    ${context.substring(0, 10000)}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        });  

        const generatedText = response.text;
        return generatedText
    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to generate concept explanation using Gemini AI');
    }
};
