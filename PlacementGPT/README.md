# PlacementGPT – Offline AI Placement Preparation Assistant

An offline AI chatbot designed to help students prepare for job placements, technical interviews, HR interviews, and more using a local LLM (Llama 3.2:3b) and RAG (Retrieval-Augmented Generation).

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

## Frontend Setup (Windows)

```powershell
cd frontend
npm install
npm run dev
```

## Application URLs

* Frontend: http://localhost:5173
* Backend: http://localhost:8000
* API Documentation: http://localhost:8000/docs
