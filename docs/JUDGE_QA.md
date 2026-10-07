# Guru Offline — Judge Q&A Guide

Answers to key architectural and pedagogical questions from hackathon evaluators.

---

### Q1: Why not just use ChatGPT or a cloud API?
**Answer:**
Because ChatGPT, Gemini, and Claude require continuous high-speed internet connectivity. In rural, tribal, and economically disadvantaged areas across India and the developing world, students have intermittent, expensive, or zero mobile data. When connectivity drops, cloud chatbots are completely useless. **Guru Offline** runs on-device so students can study anywhere — in remote villages, during power outages, or on bus commutes without spending money on data packs.

---

### Q2: Why use a small model (SLM) instead of an 8B or 70B parameter model?
**Answer:**
Because our target hardware is an entry-level smartphone priced at ~₹8,000 with 2GB–3GB of RAM. An 8B model requires at least 5GB–6GB of RAM even with 4-bit quantization, causing instant Android `LowMemoryKiller` (LMK) crashes. By using a 4-bit quantized Small Language Model (like `SmolLM-135M` or `360M`), the entire model occupies only **72.4 MB** of storage and **~145 MB** of RAM, running at over **16 tokens/second** on budget Cortex-A53 cores.

---

### Q3: Why downloadable modules instead of packing all textbooks into the app?
**Answer:**
Entry-level phones have limited internal storage (typically 32GB, heavily occupied by Android OS and media). Packing Grades 1 through 12 across all subjects would bloat the app to several gigabytes. With our modular architecture, a Class 10 student only downloads the specific subjects they are studying (e.g., 72 MB for Math). They can add or remove modules as needed.

---

### Q4: How do you keep the AI curriculum-aware and prevent hallucinations?
**Answer:**
We implement **On-Device Retrieval-Augmented Generation (Local RAG)**. When a student asks a question, our local BM25 search engine queries the downloaded curriculum index in under 5 milliseconds. The retrieved textbook definitions, formulas, and approved examples are injected directly into the model's context window. The SLM is instructed to act as an empathetic teacher and ground its step-by-step reasoning strictly on that curriculum material.

---

### Q5: Does it truly work without internet?
**Answer:**
Yes, 100%. Internet is only used during the initial module download. Once downloaded, **Wi-Fi = OFF** and **Mobile Data = OFF**. All inference, prompt assembly, RAG retrieval, practice scoring, quiz evaluation, and safety filtering execute natively on the phone's CPU.

---

### Q6: Can the architecture support other classes and higher education?
**Answer:**
Yes. The core AI inference and RAG engines are completely agnostic to the curriculum content. Adding Class 12 Physics, UPSC preparation, or BCA Computer Science simply requires creating a new folder with `metadata.json`, chapters, and an inverted index. The app immediately recognizes and renders the new subject.

---

### Q7: Can it support Indian regional languages (Hindi, Tamil, Bengali)?
**Answer:**
Yes. The MVP includes English, and the architecture supports multi-lingual modules. Because the curriculum text and retrieval index are modular, localized language packs (e.g. Hindi NCERT Science) can be swapped in without modifying the underlying app engine.

---

### Q8: What happens if the model gives an inaccurate answer?
**Answer:**
We don't make unsubstantiated claims of "zero hallucinations." To maximize accuracy:
1. **Local RAG Grounding:** The model is constrained to the verified textbook chunks.
2. **Formula & Logic Solvers:** Algebraic equations and physics arithmetic pass through specialized numerical verification helpers.
3. **Citations:** Every response displays the exact textbook chapter and section used, allowing students to cross-reference their physical textbooks.
