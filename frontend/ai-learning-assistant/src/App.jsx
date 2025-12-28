import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import DocumentListPage from './pages/Documents/DocumentListPage'
import DocumentDetailPage from './pages/Documents/DocumentDetailPage'
import FlashcardsListPage from './pages/Flashcards/FlashcardPage'
import FlashcardPage from './pages/Flashcards/FlashcardPage'
import QuizTakePage from './pages/Quizzes/QuizTakePage'
import QuizResultPage from './pages/Quizzes/QuizResultPage'
import ProfilePage from './pages/Profile/ProfilePage'
import Protected from './components/auth/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import Spinner from './components/common/Spinner'

const App = () => {

  const { isAuthenticated, loading } = useAuth(); 
  
  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50'>
        <div className='text-center'>
          <Spinner />
          <p className='text-indigo-600/80 mt-4 text-sm font-medium'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<Protected />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:id" element={<DocumentDetailPage />} />
          <Route path="/flashcards" element={<FlashcardsListPage />} />
          <Route path="/documents/:id/flashcards" element={<FlashcardPage />} />
          <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
          <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>


        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App
