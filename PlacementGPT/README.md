# PlacementGPT – Offline Placement Preparation Assistant

An offline placement preparation workspace for technical interviews, HR rounds, resume structure, and company prep using a local LLM (`llama3.2:3b` via Ollama) and RAG (ChromaDB).

## Features

* **Local RAG Chat**: Ask placement and interview questions answered from your indexed PDFs with page-level source citations.
* **Knowledge Base Management**: Upload and index custom PDF study notes up to 20 MB.
* **Authentication**: Local email/password sign-up & sign-in backed by SQLite (`backend/users.db`), plus Firebase Google Sign-In.
* **User-Scoped History**: Conversations are stored per signed-in account, with profile photo and logout in the sidebar.
* **Light & Dark Themes**: Warm paper-and-ink palette with `Newsreader`, `Instrument Sans`, and `JetBrains Mono` typography.

## Prerequisites

* Python 3.10 or newer
* Node.js 18 or newer
* Ollama

## Ollama Setup

Install the required model:
```bash
ollama pull llama3.2:3b
```

Start the Ollama server:
```bash
ollama serve
```

## Backend Setup (Windows)

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
copy .env.example .env
python ingest.py
uvicorn app:app --reload
```

### Auth Endpoints

* `POST /auth/register` – Create a local account (`name`, `email`, `password`)
* `POST /auth/login` – Sign in and receive a bearer session token
* `POST /auth/logout` – Invalidate the current session token
* `GET /auth/me` – Fetch the authenticated user

## Frontend Setup (Windows)

```powershell
cd frontend
npm install
npm run dev
```

For Google Sign-In, ensure **Google** is enabled under **Authentication → Sign-in method** in your Firebase Console and `localhost` is listed under **Authorized domains**.

## Application URLs

* Frontend: http://localhost:5173
* Backend: http://localhost:8000
* API Documentation: http://localhost:8000/docs
