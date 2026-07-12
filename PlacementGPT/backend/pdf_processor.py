import os
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter

def extract_text_from_pdf(pdf_path: str) -> list[dict]:
    """
    Extract text from a PDF file page by page.
    Returns a list of dicts with text and page number.
    """
    try:
        reader = PdfReader(pdf_path)
        pages_data = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                pages_data.append({
                    "text": text,
                    "page": i + 1
                })
        return pages_data
    except Exception as e:
        print(f"Error reading PDF {pdf_path}: {e}")
        return []

def process_pdf(pdf_path: str, filename: str, category: str = "Uncategorized") -> tuple[list[str], list[dict], list[str]]:
    """
    Process a PDF file: extract text, split into chunks, and prepare metadata.
    Returns chunks, metadatas, and ids ready for ChromaDB.
    """
    pages_data = extract_text_from_pdf(pdf_path)
    
    # 800 characters, 150 overlap
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        length_function=len,
        is_separator_regex=False,
    )
    
    all_chunks = []
    all_metadatas = []
    all_ids = []
    
    for page_data in pages_data:
        chunks = text_splitter.split_text(page_data["text"])
        
        for i, chunk in enumerate(chunks):
            chunk_id = f"{filename}_p{page_data['page']}_c{i}"
            
            all_chunks.append(chunk)
            all_metadatas.append({
                "source": filename,
                "category": category,
                "page": page_data["page"],
                "chunk_id": i
            })
            all_ids.append(chunk_id)
            
    return all_chunks, all_metadatas, all_ids
