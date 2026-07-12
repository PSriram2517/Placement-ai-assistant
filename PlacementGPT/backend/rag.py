import chromadb
from chromadb.config import Settings
from config import CHROMA_DB_DIR, COLLECTION_NAME
from embeddings import embedding_service

class RAGService:
    def __init__(self):
        # Initialize ChromaDB client using the local directory
        self.client = chromadb.PersistentClient(
            path=str(CHROMA_DB_DIR),
            settings=Settings(anonymized_telemetry=False)
        )
        self.collection = self.client.get_or_create_collection(name=COLLECTION_NAME)
        
    def add_chunks(self, chunks: list[str], metadatas: list[dict], ids: list[str]):
        """Add document chunks with their embeddings to ChromaDB."""
        if not chunks:
            return 0
            
        embeddings = embedding_service.get_embeddings(chunks)
        
        self.collection.add(
            embeddings=embeddings,
            documents=chunks,
            metadatas=metadatas,
            ids=ids
        )
        return len(chunks)
        
    def search(self, query: str, n_results: int = 5) -> list[dict]:
        """Search ChromaDB for chunks similar to the query."""
        if self.collection.count() == 0:
            return []
            
        query_embedding = embedding_service.get_embedding(query)
        
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        
        formatted_results = []
        if results and results["documents"] and len(results["documents"]) > 0:
            documents = results["documents"][0]
            metadatas = results["metadatas"][0]
            
            for doc, meta in zip(documents, metadatas):
                formatted_results.append({
                    "content": doc,
                    "metadata": meta
                })
                
        return formatted_results

# Singleton instance
rag_service = RAGService()
