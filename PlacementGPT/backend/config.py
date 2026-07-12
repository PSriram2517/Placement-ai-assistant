import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Base directories
BASE_DIR = Path(__file__).resolve().parent
KNOWLEDGE_BASE_DIR = BASE_DIR / "knowledge_base"
UPLOADS_DIR = BASE_DIR / "uploads"
CHROMA_DB_DIR = BASE_DIR / "chroma_db"

# Ensure directories exist
for directory in [KNOWLEDGE_BASE_DIR, UPLOADS_DIR, CHROMA_DB_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

# Knowledge Base Categories
CATEGORIES = [
    "Companies", "DSA", "Resume", "HR", "Aptitude", 
    "React", "Python", "SQL", "DBMS", "OS", "Networks"
]

for category in CATEGORIES:
    (KNOWLEDGE_BASE_DIR / category).mkdir(exist_ok=True)

# Ollama Settings
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:3b")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

# Embeddings Settings
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
COLLECTION_NAME = "placement_knowledge"

# File size limit (20 MB)
MAX_FILE_SIZE = 20 * 1024 * 1024
