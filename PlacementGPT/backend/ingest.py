import os
from pathlib import Path
from config import KNOWLEDGE_BASE_DIR, CATEGORIES
from pdf_processor import process_pdf
from rag import rag_service

def ingest_all_pdfs():
    """Scan knowledge_base directory and ingest all PDFs into ChromaDB."""
    print("Starting ingestion process...")
    total_chunks_added = 0
    
    # Check all category folders
    for category in CATEGORIES:
        category_path = KNOWLEDGE_BASE_DIR / category
        if not category_path.exists():
            continue
            
        # Find all PDFs in this category
        pdf_files = list(category_path.glob("*.pdf"))
        if not pdf_files:
            continue
            
        print(f"Found {len(pdf_files)} PDFs in category '{category}'")
        
        for pdf_path in pdf_files:
            filename = pdf_path.name
            print(f"Processing {filename}...")
            
            chunks, metadatas, ids = process_pdf(
                str(pdf_path), 
                filename=filename, 
                category=category
            )
            
            if chunks:
                added = rag_service.add_chunks(chunks, metadatas, ids)
                total_chunks_added += added
                print(f"  Added {added} chunks from {filename}")
            else:
                print(f"  No text extracted from {filename}")
                
    print(f"Ingestion complete. Total chunks added: {total_chunks_added}")
    return total_chunks_added

if __name__ == "__main__":
    ingest_all_pdfs()
