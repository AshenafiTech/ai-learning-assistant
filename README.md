# AI Learning Assistant

A study copilot that turns PDFs into actionable study materials so you stop rereading and start retaining. It solves:
- Scattered study workflows: upload once, get flashcards, quizzes, summaries, and chat in one place.
- Slow comprehension: AI chat answers questions with document-grounded context.
- Passive reading: auto-generated quizzes and flashcards promote active recall.
- Content overload: concise summaries highlight what matters.
- Context loss: dashboard tracks documents, flashcard sets, quizzes, and progress per user.

## What you get
- PDF ingestion with text extraction and chunking
- AI-powered flashcards, quizzes, summaries, and Q&A (Gemini)
- Secure user accounts with JWT auth
- Document viewer with direct PDF access
- Progress views for flashcards/quizzes per document

## Tech
- Backend: Express, MongoDB/Mongoose, JWT auth, Multer uploads, Gemini (@google/genai)
- Frontend: React + Vite, React Router, axios

## Local setup
1) Backend
	 - `cd backend`
	 - Copy `.env.example` to `.env` and fill values.
	 - `npm install`
	 - `npm run dev`
2) Frontend
	 - `cd frontend/ai-learning-assistant`
	 - Copy `.env.example` to `.env` and fill values.
	 - `npm install`
	 - `npm run dev`

## Environment variables
- Backend (`backend/.env`)
	- `PORT=5000`
	- `MONGODB_URI=` (Atlas URI)
	- `JWT_SECRET=`
	- `GEMINI_API_KEY=`
	- `GEMINI_MODEL_QUIZ=` (optional, default gemini-2.5-flash-lite)
	- `GEMINI_MAX_OUTPUT_TOKENS=1024` (optional)
	- `GEMINI_TEMPERATURE=0.6` (optional)
	- `PUBLIC_BASE_URL=http://localhost:5000` (Render URL in prod)
	- `FRONTEND_URLS=http://localhost:5173` (comma-separated allowed origins)
- Frontend (`frontend/ai-learning-assistant/.env`)
	- `VITE_API_BASE_URL=http://localhost:5000`

## Deploy (free tiers)
- Backend on Render
	- Use `backend/render.yaml` (web service, `npm start`, health `/health`).
	- Set envs: `MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `PUBLIC_BASE_URL=https://<render-app>.onrender.com`, `FRONTEND_URLS=https://<vercel-app>.vercel.app` (+ optional Gemini tuning vars).
	- Mongo: Atlas free tier, plug URI into `MONGODB_URI`.
- Frontend on Vercel
	- Root: `frontend/ai-learning-assistant`
	- Build: `npm run build`; Output: `dist`
	- Env: `VITE_API_BASE_URL=https://<render-app>.onrender.com`

## Notes
- Health check: `GET /health` (backend)
- Uploads: served from `/uploads`; file URLs use `PUBLIC_BASE_URL`
- CORS: configured via `FRONTEND_URLS` (comma-separated origins); credentials disabled when using `*`
