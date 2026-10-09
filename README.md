# AI-Based User Feedback Synthesis System

MERN-stack academic project for turning large volumes of user feedback into actionable product insights using Gemini.

**Owner:** Darsi Sowmya Sri  


## Stack
- React + Vite + Tailwind CSS + Recharts
- Node.js + Express
- MongoDB + Mongoose
- Gemini API
- CSV upload with multer/csv-parser
- JWT + bcrypt authentication

## Core workflow
CSV → validation → column detection → cleaning → Gemini batch analysis → aggregation → topics/issues/features → similarity groups → trends → synthesis → dashboard.

## Run
1. Install Node.js 18+ and MongoDB.
2. Copy `server/.env.example` to `server/.env` and add your Gemini key and MongoDB URI.
3. Run `npm install` in the root, then `npm run install-all`.
4. Run `npm run dev`.
5. Open http://localhost:5173.

The app can run without a dataset; upload your real CSV from **Data Import**. No analytics are hardcoded.

## Dataset
The importer detects likely feedback, sentiment, date, rating, product, category and source columns. Missing optional fields are supported. If no date exists, time-based analytics are disabled rather than fabricated.

## Gemini
The backend batches records and requests structured JSON. The key never reaches the browser. See `server/services/geminiService.js`.

## Important
This is a feedback synthesis application, not merely a sentiment classifier. Sentiment is one analytical dimension among topics, recurring issues, feature requests, keywords, semantic groups, trends and AI-generated synthesis.

## Product-specific trend analysis
The Trends page lets the user search/select a product. For a selected product it shows feedback volume by month, feature-request volume, issue volume, sentiment, and a demand signal. The demand signal is explicitly a feedback-volume proxy, not a sales forecast. Recent and overall period changes are calculated from the analyzed dataset.

## Analysis fallback
If Gemini is unavailable or a Gemini batch fails, the server uses a deterministic local analysis fallback based on the uploaded feedback text and existing dataset labels. This keeps the academic demo functional while clearly storing `analysisSource=local-fallback`.
