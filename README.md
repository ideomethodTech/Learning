# Chat → PPT (AI-Powered Presentation Builder)

**Stack:** React + Tailwind • FastAPI (Python) • Google Gemini 2.5 Flash-Lite API • python-pptx

## Overview
This web app automatically generates complete PowerPoint presentations (.pptx) using Google Gemini AI.  
Users can input a topic and slide count — Gemini generates structured slide outlines and content, and the backend builds a downloadable .pptx file using `python-pptx`.

## Features
- AI text generation with Gemini 2.5 Flash-Lite (free Google API)  
- Real-time preview before download  
- Custom background themes (Blue / Pink / Dark / etc.)  
- Slide content depth levels: Basic / Detailed / Comprehensive  
- History tracking + download counter  
- Fullstack deployment-ready (Render + Vercel)

## Tech Stack

| Layer        | Tech                                   |
|--------------|----------------------------------------|
| Frontend     | React + Tailwind CSS + Vite            |
| Backend      | FastAPI (Python)                       |
| AI Model     | Google Gemini 2.5 Flash-Lite           |
| PPT Generator| python-pptx                            |
| Database     | SQLite (for history & metrics)         |
| Deployment   | Render (backend) + Vercel (frontend)   |

## Why Gemini API?

- Free for small-scale & educational projects (≈ 500–1000 req/day)  
- High-speed text generation  
- Supports structured content (bullets, summaries)  
- Google-managed cloud model — no self-hosting required

---

## Setup Instructions

### 1. Backend Setup

```
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in backend/:

```
GEMINI_API_KEY=your_google_api_key_here
GEMINI_MODEL=gemini-2.5-flash-lite
```

Run locally:

```
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Test it:

```
curl http://localhost:8000/api/health
```

Expected Response:

```
{
  "ok": true,
  "model": "gemini-2.5-flash-lite",
  "status": "Gemini AI Connected"
}
```

### 2. Frontend Setup

```
cd frontend
npm install
```

Create a `.env` file in frontend/:

```
VITE_API_URL=https://chat-to-ppt-backend.onrender.com
```

Run locally:

```
npm run dev
```

Then open → http://localhost:5173

### Architecture

```
React (Vite + Tailwind)
      ↓
FastAPI Backend
      ↓
Google Gemini API → AI text generation
      ↓
python-pptx → .pptx file
```

## Usage Guide

| Step   | Action                                      |
|--------|---------------------------------------------|
| 1      | Enter a topic & select slide count          |
| 2      | Choose color theme & content depth          |
| 3      | Click Preview to generate outline           |
| 4      | Review slides in browser                    |
| 5      | Click Download PPT to get your file         |

## Troubleshooting

| Issue                       | Fix                                      |
|-----------------------------|------------------------------------------|
| API key invalid             | Check .env in backend                    |
| "Model not found"           | Use gemini-2.5-flash-lite                |
| Frontend not connecting     | Check VITE_API_URL matches backend URL   |
| Port busy                   | sudo lsof -t -i:8000                     |

## Deployment

### Backend (Render)

- Language: Python 3
- Root Directory: backend
- Build Command:

  ```
  pip install -r requirements.txt
  ```

- Start Command:

  ```
  bash start.sh
  ```

- Environment Variables (in Render dashboard):
  ```
  GEMINI_API_KEY = your_api_key
  GEMINI_MODEL = gemini-2.5-flash-lite
  ```

### Frontend (Vercel)

- Framework: Vite + React

- Environment Variable:
  ```
  VITE_API_URL = https://your-backend-name.onrender.com
  ```

## Demo Script

“This web app automatically creates PowerPoint presentations using Google Gemini AI. Users enter a topic, and Gemini generates structured slide outlines, which are then converted into .pptx files using python-pptx. The app is deployed with a FastAPI backend (Render) and React frontend (Vercel).”

## Completed Work Summary

- Integrated Google Gemini 2.5 Flash-Lite API
- Implemented FastAPI endpoints for text → PPT
- Added .env config for secure API key management
- Built modern React + Tailwind UI
- Added history tracking, metrics & PPT export
- Fully deployed (Render + Vercel)

## License

This project is open-source for learning and demonstration purposes.


