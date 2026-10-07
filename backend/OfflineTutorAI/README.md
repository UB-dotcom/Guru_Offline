# OfflineTutorAI Module

`OfflineTutorAI` is an offline-first Android tutoring engine module designed for mobile educational apps. It provides local curriculum knowledge storage (SQLite FTS5), local RAG retrieval, safety checking, system prompt building, and local SLM inference without any cloud LLM dependency.

---

## 🏗️ Directory Architecture

```
OfflineTutorAI/
│
├── curriculum/
│   ├── source/              # Raw curriculum source PDFs and text files
│   ├── processed/           # Extracted & cleaned text JSON files
│   └── chunks/              # Structured curriculum chunk JSON datasets
│
├── database/
│   ├── schema/
│   │   └── schema.sql       # SQLite DDL schema with FTS5 search index
│   ├── repositories/
│   │   └── curriculum_repository.py # Data access layer & BM25 query runner
│   └── migrations/
│       └── 001_initial_schema.sql
│
├── rag/
│   ├── chunker/
│   │   └── text_chunker.py  # Semantic section and topic chunker
│   ├── retriever/
│   │   └── sqlite_retriever.py # FTS5 + BM25 offline retriever
│   └── index/
│       └── index_manager.py # Index health, statistics, and sync manager
│
├── ai/
│   ├── local_llm/
│   │   ├── engine_base.py   # Base local SLM interface
│   │   ├── llama_cpp_engine.py # LlamaCpp binding runner for GGUF models
│   │   └── offline_engine.py   # Standard offline deterministic SLM engine
│   ├── prompt_builder/
│   │   └── tutor_prompt_builder.py # Pedagogical prompt context assembler
│   └── response_processor/
│       └── response_processor.py # Formatting, markdown cleanup & citation extraction
│
├── safety/
│   └── safety_guard.py      # Pre-retrieval safety, injection filter & subject check
│
├── scripts/
│   ├── pdf_extractor.py     # 1. Page-by-page PDF/text extractor
│   ├── text_cleaner.py      # 2. Text cleaning & normalization
│   ├── segmenter.py         # 3. Chapter & topic structural segmenter
│   ├── chunk_creator.py     # 4. Meaningful chunk creation with metadata
│   ├── build_db.py          # 5. SQLite database creation & FTS index build
│   └── test_retrieval.py    # 6. Local retrieval test runner
│
├── tests/                   # Complete unit and integration test suite
│
├── models/
│   ├── chunk_model.py       # CurriculumChunk model (9 required fields)
│   └── tutor_response.py    # TutorRequest, TutorResponse, SafetyCheckResult models
│
├── service.py               # Main API interface: ask_tutor(...)
├── config.py                # System configuration & directory paths
└── docs/
    └── REACT_NATIVE_INTEGRATION.md # Guide for React Native frontend team
```

---

## 🔒 Offline Guarantee

This backend module has **ZERO** reliance on cloud LLMs:
- ❌ NO OpenAI API
- ❌ NO Gemini API
- ❌ NO Claude API
- ❌ NO Groq API
- ❌ NO Firebase AI
- ✅ 100% Offline Local SQLite FTS5 Retrieval + Local SLM Execution

---

## 🗄️ SQLite Curriculum Database Schema

The database stores curriculum knowledge (no hardcoded QA pairs). Each chunk stores:

| Field Name | Type | Description |
|---|---|---|
| `id` | `INTEGER PRIMARY KEY` | Auto-incremented row identifier |
| `board` | `TEXT` | Educational board (e.g. CBSE, NCERT, ICSE) |
| `class` | `TEXT` | Grade/Class (e.g. Class 10) |
| `subject` | `TEXT` | Subject name (e.g. Science, Physics) |
| `chapter` | `TEXT` | Chapter title |
| `topic` | `TEXT` | Specific topic heading |
| `content` | `TEXT` | Educational body text |
| `source_page` | `TEXT` | Reference page number |
| `chunk_id` | `TEXT UNIQUE` | Unique identifier (e.g. `CBSE-10-SCI-CH10-TP01-001`) |

Full Text Search is enabled via `curriculum_chunks_fts` virtual table using SQLite FTS5 for fast BM25 score ranking on-device.

---

## 🔄 Internal Service Execution Flow

Calling `ask_tutor(question, subject, language, conversation_history)` triggers:

```
question
  │
  ▼
[ safety/safety_guard.py ] ─────── (If unsafe) ──────► Standard Safety Response
  │ (If safe)
  ▼
[ rag/retriever/sqlite_retriever.py ] ──► Queries SQLite FTS5
  │
  ▼
[ relevant curriculum chunks ]
  │
  ▼
[ ai/prompt_builder/tutor_prompt_builder.py ] ──► System & User Context Prompts
  │
  ▼
[ ai/local_llm (LlamaCppEngine / LocalOfflineEngine) ] ──► Local Inference
  │
  ▼
[ ai/response_processor/response_processor.py ] ──► Formats Markdown & Sources
  │
  ▼
[ answer ] ──► Structured TutorResponse Payload
```

---

## 🛠️ CLI Pipeline Scripts

1. **PDF Text Extraction**:
   ```bash
   python OfflineTutorAI/scripts/pdf_extractor.py
   ```
2. **Text Cleaning**:
   ```bash
   python OfflineTutorAI/scripts/text_cleaner.py
   ```
3. **Chapter/Topic Segmentation**:
   ```bash
   python OfflineTutorAI/scripts/segmenter.py
   ```
4. **Meaningful Chunk Creation**:
   ```bash
   python OfflineTutorAI/scripts/chunk_creator.py
   ```
5. **SQLite Database Creation**:
   ```bash
   python OfflineTutorAI/scripts/build_db.py
   ```
6. **Local Retrieval Testing**:
   ```bash
   python OfflineTutorAI/scripts/test_retrieval.py
   ```

---

## 🧪 Running Unit Tests

Run the full test suite with standard Python `unittest`:

```bash
python -m unittest discover -s OfflineTutorAI/tests -p "test_*.py"
```

---

## 📱 React Native Frontend Integration Guide

Refer to [REACT_NATIVE_INTEGRATION.md](file:///c:/Users/ACER/Documents/GURUOffline_Backend/OfflineTutorAI/docs/REACT_NATIVE_INTEGRATION.md) for step-by-step instructions on connecting the React Native frontend to this offline backend module on Android devices.
