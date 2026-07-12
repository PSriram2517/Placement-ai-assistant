from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
from pathlib import Path

from config import UPLOADS_DIR, OLLAMA_MODEL
from chatbot import chatbot_service
from pdf_processor import process_pdf
from rag import rag_service
from ingest import ingest_all_pdfs

app = FastAPI(title="PlacementGPT API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str
    conversation_id: str | None = None

class ChatResponse(BaseModel):
    answer: str
    sources: list[dict]
    model: str

@app.get("/health")
def health_check():
    """Health check endpoint to verify backend and Ollama status."""
    is_running, message = chatbot_service.check_ollama_status()
    
    return {
        "status": "healthy",
        "ollama": "connected" if is_running else "disconnected",
        "ollama_message": message,
        "model": OLLAMA_MODEL
    }

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """Chat endpoint to answer questions based on the knowledge base."""
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
        
    try:
        response = chatbot_service.ask(request.question)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
def upload_pdf(file: UploadFile = File(...)):
    """Upload a PDF, extract text, and add it to the knowledge base."""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
    file_path = UPLOADS_DIR / file.filename
    
    try:
        # Save file to uploads directory
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Process the PDF
        chunks, metadatas, ids = process_pdf(
            str(file_path),
            filename=file.filename,
            category="Uploads"
        )
        
        if not chunks:
            raise HTTPException(status_code=400, detail="Could not extract text from the PDF. It might be empty or scanned.")
            
        # Add to ChromaDB
        chunks_added = rag_service.add_chunks(chunks, metadatas, ids)
        
        return {
            "message": "PDF uploaded and added to the knowledge base",
            "filename": file.filename,
            "chunks_added": chunks_added
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing upload: {str(e)}")

@app.get("/documents")
def list_documents():
    """List all PDFs in the uploads and knowledge_base directories."""
    documents = []
    
    # Check uploads dir
    if UPLOADS_DIR.exists():
        for file_path in UPLOADS_DIR.glob("*.pdf"):
            documents.append({
                "id": file_path.name,
                "name": file_path.name,
                "size": file_path.stat().st_size,
                "type": "Upload",
                "date": file_path.stat().st_mtime
            })
            
    # Check knowledge_base dir (default docs)
    from config import KNOWLEDGE_BASE_DIR
    if KNOWLEDGE_BASE_DIR.exists():
        for file_path in KNOWLEDGE_BASE_DIR.glob("*.pdf"):
            documents.append({
                "id": f"kb_{file_path.name}",
                "name": file_path.name,
                "size": file_path.stat().st_size,
                "type": "System",
                "date": file_path.stat().st_mtime
            })
            
    # Sort by date descending
    documents.sort(key=lambda x: x["date"], reverse=True)
    return {"documents": documents}

@app.post("/ingest")
def rebuild_knowledge_base():
    """Rebuild the knowledge base from the knowledge_base directory."""
    try:
        chunks_added = ingest_all_pdfs()
        return {
            "message": "Knowledge base rebuilt successfully",
            "chunks_added": chunks_added
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error rebuilding knowledge base: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
