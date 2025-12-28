import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import ChatHistory from '../models/ChatHistory.js';
import * as geminiService from '../utils/geminiService.js';
import { chunkText, findRelevantChunks } from '../utils/textChunker.js';

// @desc Generate flashcards for a document
// @route POST /api/ai/generate-flashcards
// @access Private
export const generateFlashcards = async (req, res, next) => {
    try {
        const { documentId, count = 10 } = req.body;   
        
        if (!documentId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please provide documentId',
                status: 400,
            });
        }

        // Fetch document
        const document = await Document.findOne({ 
            _id: documentId,
            userId: req.user._id,
            status: 'ready',
        });

        if (!document) {
            return res.status(404).json({ 
                success: false, 
                error: 'Document not found or not processed yet',
                status: 404,
            });
        }

        const sourceText = document.extractedText || '';
        if (!sourceText.trim()) {
            return res.status(422).json({
                success: false,
                error: 'Document has no extracted text to generate flashcards',
                status: 422,
            });
        }

        // Generate flashcards using Gemini AI
        const cards = await geminiService.generateFlashcards(
            sourceText, 
            parseInt(count)
        );

        // Save flashcards to DB
        const flashcardSet = await Flashcard.create({
            userId: req.user._id,
            documentId: document._id,
            cards: cards.map(card => ({
                question: card.question,
                answer: card.answer,
                difficulty: card.difficulty,
                reviewCount: 0,
                isStarred: false,
            })),
        });

        res.status(201).json({
            success: true,
            data: flashcardSet,
            message: `Flashcards generated successfully` 
        });
    } catch (error) {
        next(error);    
    }
};

// @desc Generate quiz for a document
// @route POST /api/ai/generate-quiz
// @access Private
export const generateQuiz = async (req, res, next) => {
    try {
        const { documentId, numQuestions = 5, title } = req.body;  
        
        if (!documentId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please provide documentId',
                status: 400,
            });
        }

        // Fetch document
        const document = await Document.findOne({ 
            _id: documentId,
            userId: req.user._id,
            status: 'ready',
        });

        if (!document) {
            return res.status(404).json({ 
                success: false, 
                error: 'Document not found or not processed yet',
                status: 404,
            });
        }


        const sourceText = document.extractedText || '';
        if (!sourceText.trim()) {
            return res.status(422).json({
                success: false,
                error: 'Document has no extracted text to generate quiz',
                status: 422,
            });
        }

        // Generate quiz using Gemini AI
        const questions = await geminiService.generateQuiz(
            document.extractedText, 
            parseInt(numQuestions)
        );

        // Save quiz to DB
        const quiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            title: title || `${document.title} - Quiz`,
            questions: questions,
            totalQuestions: questions.length,
            userAnswers: [],
            score: 0,         
        });

        res.status(201).json({
            success: true,
            data: quiz,
            message: `Quiz generated successfully` 
        });

    } catch (error) {
        next(error);    
    }
};

// @desc Generate summary for a document
// @route POST /api/ai/generate-summary
// @access Private
export const generateSummary = async (req, res, next) => {
    try {
        const { documentId } = req.body; 
        
        if (!documentId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please provide documentId',
                status: 400,
            });
        }

        // Fetch document
        const document = await Document.findOne({ 
            _id: documentId,
            userId: req.user._id,
            status: 'ready',
        });

        if (!document) {
            return res.status(404).json({ 
                success: false, 
                error: 'Document not found or not processed yet',
                statusCode: 404,
            });
        }

        // Generate summary using Gemini AI
        const summary = await geminiService.generateSummary(document.extractedText);

        res.status(200).json({
            success: true,
            data: {
                documentId: document._id,
                title: document.title,
                summary
            },
            message: 'Summary generated successfully'
        });

    } catch (error) {
        next(error);    
    }
};

// @desc Chat about a document
// @route POST /api/ai/chat
// @access Private
export const chat = async (req, res, next) => {
    try {
        const { documentId, question } = req.body; 
        
        if (!documentId || !question) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please provide documentId and question',
                status: 400,
            });
        }

        // Fetch document
        const document = await Document.findOne({ 
            _id: documentId,
            userId: req.user._id,
            status: 'ready',
        });

        if (!document) {
            return res.status(404).json({ 
                success: false, 
                error: 'Document not found or not processed yet',
                statusCode: 404,
            });
        }

        // Build chunks from document text, then find the most relevant ones
        const chunks = chunkText(document.extractedText || '', 500, 50);
        const relevantChunks = findRelevantChunks(chunks, question, 3);
        const chunkIndices = relevantChunks.map(c => c.chunkIndex)

        // Get or Generate chat history
        let chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: document._id,
        })

        if (!chatHistory) {
            chatHistory = await ChatHistory.create({
                userId: req.user._id,
                documentId: document._id,
                messages: []
            });
        }

        // Generate reponse using Gemini AI with context
        const answer = await geminiService.chatWithContext(question, relevantChunks);

        // Save chat message
        chatHistory.messages.push({
            role: 'user',
            content: question,
            timestamp: new Date(),
            relevantChunks: []
        },
        {
            role: 'assistant',
            content: answer,
            timestamp: new Date(),
            relevantChunks: chunkIndices
        }
    );

        await chatHistory.save();

        res.status(200).json({
            success: true,
            data: {
                question,
                answer,
                relevantChunks: chunkIndices,
                chatHistoryId: chatHistory._id,
            },
            message: 'Chat response generated successfully'
        }); 
    } catch (error) {
        next(error);    
    }
};

// @desc Explain a concept from a document
// @route POST /api/ai/explain-concept
// @access Private
export const explainConcept = async (req, res, next) => {
    try {
        const { documentId, concept } = req.body; 
        
        if (!documentId || !concept) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please provide documentId and concept',
                status: 400,
            });
        }

        // Fetch document
        const document = await Document.findOne({ 
            _id: documentId,
            userId: req.user._id,
            status: 'ready',
        });

        if (!document) {
            return res.status(404).json({ 
                success: false, 
                error: 'Document not found or not processed yet',
                statusCode: 404,
            });
        }

        // Find Relevant chunks for the concept
        const relevantChunks = findRelevantChunks(document.chunks, concept, 3);
        const context = relevantChunks.map(c => c.content).join('\n\n');

        // Generate explanation using Gemini AI
        const explanation = await geminiService.explainConcept(concept, context);

        res.status(200).json({
            success: true,
            data: {
                concept,
                explanation,
                relevantChunks: relevantChunks.map(c => c.chunkIndex),
            },
            message: ' Explanation generated successfully'
        });
    } catch (error) {
        next(error);    
    }
};

// @desc Get chat history for a document
// @route GET /api/ai/chat-history/:documentId
// @access Private
export const getChatHistory = async (req, res, next) => {
    try {
        const { documentId } = req.params;

        if (!documentId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please provide documentId',
                status: 400,
            });
        }

        const chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: documentId,
        }).select('messages'); // Only retrieve the messages array

        if (!chatHistory) {
            return res.status(200).json({ 
                success: true, 
                data:[], // Return an empty array if no history
                message: 'No chat history found for this document'
            });
        }

        res.status(200).json({
            success: true,
            data: chatHistory.messages,
            message: 'Chat history retrieved successfully'
        });
    } catch (error) {
        next(error);    
    }
};