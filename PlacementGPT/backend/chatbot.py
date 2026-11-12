import requests
import json
from config import OLLAMA_BASE_URL, OLLAMA_MODEL
from rag import rag_service

SYSTEM_PROMPT = """You are PlacementGPT, an offline AI placement preparation assistant.

Your purpose is to help students prepare for job placements, internships, coding interviews, technical interviews, aptitude tests, resume screening, HR interviews, and company recruitment processes.

Answer using the provided knowledge-base context whenever possible.

Rules:

1. Answer only placement, interview, programming, aptitude, resume, company preparation, and career-preparation questions.
2. Do not answer unrelated entertainment, political, medical, financial, or general personal questions.
3. If the question is outside the placement domain, politely explain that you only assist with placement preparation.
4. Never claim that information exists in the context when it does not.
5. When the context is insufficient, clearly say that the knowledge base does not contain enough information.
6. Provide clear explanations suitable for students and beginners.
7. Use headings, bullets, examples, and code where appropriate.
8. For coding questions, include:
   - Explanation
   - Example
   - Time complexity
   - Space complexity
9. For company-preparation questions, include:
   - Recruitment stages
   - Topics to prepare
   - Preparation strategy
   - Common interview questions
10. Do not mention OpenAI, Gemini, Qwen, Mistral, Groq, or any cloud model.
11. You are running locally using Llama through Ollama.
12. Add a Sources section using only the source documents supplied in the context."""

UNRELATED_MESSAGE = "I am PlacementGPT, an assistant designed for placement preparation. Please ask me questions related to interviews, aptitude, programming, resumes, companies, or career preparation."

class ChatbotService:
    def check_ollama_status(self):
        """Check if Ollama server is running and the model is available."""
        try:
            response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5)
            response.raise_for_status()
            
            models = [model["name"] for model in response.json().get("models", [])]
            if OLLAMA_MODEL not in models and f"{OLLAMA_MODEL}:latest" not in models and f"{OLLAMA_MODEL}" not in [m.split(":")[0] for m in models]:
                return False, f"The Llama model is not installed. Run: ollama pull {OLLAMA_MODEL}"
                
            return True, "connected"
        except requests.exceptions.ConnectionError:
            return False, "Ollama is not running. Open a terminal and run: ollama serve"
        except Exception as e:
            return False, f"Error connecting to Ollama: {str(e)}"
            
    def is_placement_related(self, query: str) -> bool:
        """Heuristic check to ensure the question is somewhat related to placement. 
        The prompt also handles this, but a preliminary check could be useful. 
        For now, we let the LLM handle the domain verification via prompt instructions."""
        return True
            
    def build_prompt(self, question: str, context_results: list) -> str:
        """Build the full prompt with system instructions, context, and the user question."""
        context_text = ""
        sources_info = ""
        
        if context_results:
            context_text = "RETRIEVED CONTEXT:\n\n"
            sources_info = "SOURCE INFORMATION:\n\n"
            
            for i, result in enumerate(context_results):
                content = result.get("content", "")
                meta = result.get("metadata", {})
                
                context_text += f"--- Document {i+1} ---\n{content}\n\n"
                
                filename = meta.get("source", "Unknown")
                category = meta.get("category", "Uncategorized")
                page = meta.get("page", 0)
                
                sources_info += f"- Document {i+1}: File '{filename}', Category '{category}', Page {page}\n"
        else:
            context_text = "RETRIEVED CONTEXT: None available.\n"
            sources_info = "SOURCE INFORMATION: None available.\n"
            
        return f"{SYSTEM_PROMPT}\n\n{context_text}\n{sources_info}\nUSER QUESTION:\n{question}"

    def ask(self, question: str) -> dict:
        """Process a user question, retrieve context, and generate an answer."""
        
        # 1. Retrieve context from ChromaDB
        context_results = rag_service.search(question, n_results=5)
        
        # 2. Build the prompt
        prompt = self.build_prompt(question, context_results)
        
        # 3. Call Ollama
        try:
            payload = {
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False
            }
            
            response = requests.post(
                f"{OLLAMA_BASE_URL}/api/generate", 
                json=payload,
                timeout=300
            )
            response.raise_for_status()
            
            data = response.json()
            answer = data.get("response", "")
            
            # Extract unique sources to return in the API response
            unique_sources = []
            seen = set()
            for res in context_results:
                meta = res.get("metadata", {})
                source_id = f"{meta.get('source')}_{meta.get('page')}"
                if source_id not in seen:
                    seen.add(source_id)
                    unique_sources.append({
                        "file": meta.get("source", "Unknown"),
                        "category": meta.get("category", "Uncategorized"),
                        "page": meta.get("page", 0)
                    })
                    
            return {
                "answer": answer,
                "sources": unique_sources,
                "model": OLLAMA_MODEL
            }
            
        except requests.exceptions.ConnectionError:
            raise Exception("Ollama is not running. Open a terminal and run: ollama serve")
        except Exception as e:
            raise Exception(f"Error generating response: {str(e)}")

chatbot_service = ChatbotService()
