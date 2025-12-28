import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';

// @desc    Get user learning stats for dashboard
// @route   GET /api/progress/dashboard
// @access  Private
export const getDashboard = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get counts
        const totalDocuments = await Document.countDocuments({ userId });
        const totalFlashcardSets = await Flashcard.countDocuments({ userId });
        const totalQuizzes = await Quiz.countDocuments({ userId });
        const completedQuizzes = await Quiz.countDocuments({ userId, completedAt: {$ne: null} });

        // Get flashcard statistics
        const flashcardStats = await Flashcard.find({ userId });
        let totalFlashcards = 0;
        let reviewedFlashcards = 0;
        let starredFlashcards = 0;

        flashcardStats.forEach(set => {
            totalFlashcards += set.cards.length;
            reviewedFlashcards += set.cards.filter(card => card.reviewCount > 0).length;
            starredFlashcards += set.cards.filter(card => card.isStarred).length;
        });

        // Get quiz statistics
        const quizzes = await Quiz.find({ userId, completedAt: {$ne: null} });
        const averageScore = quizzes.length > 0
            ? Math.round(quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / quizzes.length)
            : 0;

        // Recent activities
        const recentDocuments = await Document.find({ userId })
            .sort({ updatedAt: -1 })
            .limit(5)
            .select('title fileName lastAccessed status');

        const recentQuizzes = await Quiz.find({ userId })
            .sort({ completedAt: -1 })
            .limit(5)
            .populate('documentId', 'title')
            .select('title score totalQuestions completedAt');

        // Study streak 
        const studyStreak = Math.floor(Math.random() * 7) + 1; // Placeholder for actual streak calculation

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalDocuments,
                    totalFlashcardSets,
                    totalFlashcards,
                    reviewedFlashcards,
                    starredFlashcards,
                    averageScore,
                    studyStreak,
                    totalQuizzes,
                    completedQuizzes,
                },
                recentActivities: {
                    documents: recentDocuments,
                    quizzes: recentQuizzes,
                }
            }
        });
    } catch (error) {
        next(error);
    }   
};
