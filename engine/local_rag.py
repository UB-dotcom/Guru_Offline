"""
Local RAG Engine for Guru Offline.
Performs completely offline, zero-network BM25 retrieval over modular curriculum chunks.
Retrieves the most relevant chapter, formulas, and examples, and constructs structured
curriculum-grounded prompts for on-device SLM generation.
"""

import os
import json
import re
import math
from typing import List, Dict, Any, Optional

STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
    "arent", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both",
    "but", "by", "cant", "cannot", "could", "couldnt", "did", "didnt", "do", "does", "doesnt",
    "doing", "dont", "down", "during", "each", "few", "for", "from", "further", "had", "hadnt",
    "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", "here",
    "heres", "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im",
    "ive", "if", "in", "into", "is", "isnt", "it", "its", "itself", "lets", "me", "more", "most",
    "mustnt", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other",
    "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shant", "she", "shed",
    "shell", "shes", "should", "shouldnt", "so", "some", "such", "than", "that", "thats", "the",
    "their", "theirs", "them", "themselves", "then", "there", "theres", "these", "they", "theyd",
    "theyll", "theyre", "theyve", "this", "those", "through", "to", "too", "under", "until", "up",
    "very", "was", "wasnt", "we", "wed", "well", "were", "weve", "werent", "what", "whats", "when",
    "whens", "where", "wheres", "which", "while", "who", "whos", "whom", "why", "whys", "with",
    "wont", "would", "wouldnt", "you", "youd", "youll", "youre", "youve", "your", "yours",
    "yourself", "yourselves"
}

def tokenize(text: str) -> List[str]:
    tokens = re.findall(r'[a-zA-Z0-9_\^\+\-\*\/\=\.]+', text.lower())
    return [t for t in tokens if len(t) > 1 and t not in STOPWORDS]

class LocalRagRetriever:
    """
    On-device BM25 curriculum index retriever. Operates in memory with < 5MB RAM overhead.
    """

    def __init__(self, modules_dir: Optional[str] = None):
        if not modules_dir:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            modules_dir = os.path.join(base_dir, "modules")
        self.modules_dir = modules_dir
        self.loaded_modules: Dict[str, Dict[str, Any]] = {}

    def load_module(self, module_id: str) -> bool:
        """Loads index and chunks for a downloaded module into memory."""
        if module_id in self.loaded_modules:
            return True

        m_path = os.path.join(self.modules_dir, module_id)
        index_path = os.path.join(m_path, "embeddings", "index", "index.json")
        chunks_path = os.path.join(m_path, "embeddings", "index", "chunks.json")
        meta_path = os.path.join(m_path, "metadata.json")

        if not os.path.exists(index_path) or not os.path.exists(chunks_path):
            return False

        with open(meta_path, "r", encoding="utf-8") as f:
            metadata = json.load(f)
        with open(index_path, "r", encoding="utf-8") as f:
            index_data = json.load(f)
        with open(chunks_path, "r", encoding="utf-8") as f:
            chunks = json.load(f)

        self.loaded_modules[module_id] = {
            "metadata": metadata,
            "index": index_data,
            "chunks": chunks
        }
        return True

    def retrieve(self, module_id: str, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        """
        Retrieves top_k curriculum chunks matching query using BM25.
        """
        if not self.load_module(module_id):
            return []

        mod = self.loaded_modules[module_id]
        index_data = mod["index"]
        chunks = mod["chunks"]

        tokens = tokenize(query)
        if not tokens:
            return []

        k1 = 1.5
        b = 0.75
        avg_dl = index_data.get("avg_dl", 30.0)
        doc_lengths = index_data.get("doc_lengths", [])
        idf = index_data.get("idf", {})
        inv_index = index_data.get("inverted_index", {})

        scores = [0.0] * len(chunks)

        for term in tokens:
            if term not in inv_index:
                # Check for prefix or substring match in index
                for indexed_term in inv_index:
                    if term in indexed_term or indexed_term in term:
                        term = indexed_term
                        break
                else:
                    continue

            term_idf = idf.get(term, 1.0)
            for posting in inv_index[term]:
                doc_id = posting["doc_id"]
                tf = posting["tf"]
                doc_len = doc_lengths[doc_id] if doc_id < len(doc_lengths) else avg_dl
                tf_score = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (doc_len / avg_dl)))
                scores[doc_id] += term_idf * tf_score

        # Rank documents
        scored_docs = [(i, score) for i, score in enumerate(scores) if score > 0]
        scored_docs.sort(key=lambda x: x[1], reverse=True)

        results = []
        for doc_id, score in scored_docs[:top_k]:
            c = chunks[doc_id].copy()
            c["bm25_score"] = round(score, 4)
            results.append(c)

        # Fallback to first chunk if no match
        if not results and chunks:
            fallback = chunks[0].copy()
            fallback["bm25_score"] = 0.01
            results.append(fallback)

        return results

    def build_tutor_prompt(
        self,
        module_id: str,
        student_query: str,
        mode: str = "normal",
        chat_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Assembles RAG context and formats educational tutor prompt.
        Modes:
          - 'normal': Standard step-by-step educational answer.
          - 'simpler': Highly intuitive, simplified analogy for younger understanding.
          - 'example': Practical worked example with numbers.
          - 'practice': Practice question with options.
          - 'followup': Answering follow-up question while retaining context.
        """
        retrieved_chunks = self.retrieve(module_id, student_query, top_k=2)

        meta = self.loaded_modules.get(module_id, {}).get("metadata", {})
        subject_name = meta.get("name", "Curriculum Subject")
        grade_level = meta.get("class", "School")

        context_text = "\n\n".join(
            [f"[Topic: {c.get('topic')}]\n{c.get('content')}" for c in retrieved_chunks]
        )

        system_instruction = (
            f"You are Guru, an empathetic on-device AI teacher for {subject_name} (Class {grade_level}).\n"
            "Your pedagogical guidelines:\n"
            "1. Base your explanation strictly on the provided Curriculum Context.\n"
            "2. Never give just a direct answer; always guide the student step-by-step with clear reasoning.\n"
            "3. Use polite, encouraging language.\n"
            "4. Clearly highlight formulas, key principles, and final takeaways."
        )

        mode_instructions = {
            "normal": "Explain the concept step-by-step with clear steps, formulas, and an concluding takeaway.",
            "simpler": "Explain this concept in very simple, easy-to-understand terms using an intuitive everyday analogy.",
            "example": "Provide a concrete, step-by-step worked example with numbers illustrating this concept.",
            "practice": "Give the student an engaging multiple-choice practice question based on this topic with 4 options (A, B, C, D).",
            "followup": "Answer the student's follow-up question step-by-step building upon the earlier explanation."
        }

        user_content = (
            f"CURRICULUM CONTEXT:\n{context_text}\n\n"
            f"STUDENT QUESTION: {student_query}\n\n"
            f"TASK: {mode_instructions.get(mode, mode_instructions['normal'])}"
        )

        return {
            "system_instruction": system_instruction,
            "user_prompt": user_content,
            "retrieved_context": retrieved_chunks,
            "subject": subject_name,
            "mode": mode
        }

if __name__ == "__main__":
    rag = LocalRagRetriever()
    q = "Explain Newton's second law"
    prompt_pkg = rag.build_tutor_prompt("class10_science", q, mode="normal")
    print(f"Query: {q}")
    print(f"Retrieved {len(prompt_pkg['retrieved_context'])} chunks.")
    for idx, c in enumerate(prompt_pkg['retrieved_context']):
        print(f"  Chunk {idx+1}: {c['topic']} (score: {c['bm25_score']})")
    print("\nPrompt Preview:")
    print(prompt_pkg['user_prompt'][:300] + "...")
