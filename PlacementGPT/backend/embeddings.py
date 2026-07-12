from sentence_transformers import SentenceTransformer
from config import EMBEDDING_MODEL_NAME

class EmbeddingService:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
            # This will download the model the first time it is run
            cls._instance.model = SentenceTransformer(EMBEDDING_MODEL_NAME)
        return cls._instance

    def get_embedding(self, text: str) -> list[float]:
        """Generate embedding for a given text."""
        return self.model.encode(text).tolist()

    def get_embeddings(self, texts: list[str]) -> list[list[float]]:
        """Generate embeddings for a list of texts."""
        return self.model.encode(texts).tolist()

# Singleton instance for easy import
embedding_service = EmbeddingService()
