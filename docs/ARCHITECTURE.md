# Guru Offline — Architecture & System Design

## 1. Executive Summary

**Guru Offline** is an on-device, zero-internet AI tutoring system built for students in resource-constrained and low-connectivity environments. By pairing a 4-bit quantized Small Language Model (SLM) with a modular on-device Retrieval-Augmented Generation (RAG) pipeline and rule-based safety guardrails, Guru Offline enables personalized, step-by-step tutoring on entry-level Android hardware (~₹8,000 budget phone, 2GB–3GB RAM) with **Wi-Fi and Mobile Data completely turned off**.

---

## 2. High-Level System Architecture

```text
                               +-------------------------------------+
                               |          STUDENT DEVICE             |
                               |    (Entry-level Android Phone)      |
                               +-------------------------------------+
                                                  |
                     +----------------------------+----------------------------+
                     |                                                         |
         [ INTERNET AVAILABLE ]                                      [ INTERNET OFF ]
                     |                                                         |
                     v                                                         v
         +-----------------------+                                 +-----------------------+
         | Module Downloader     |                                 | Offline AI Tutoring   |
         | - Curriculum Packs    |                                 | - Zero external calls |
         | - Manifest / Checksum |                                 | - 100% Private        |
         +-----------------------+                                 +-----------------------+
                     |                                                         |
                     +----------------------------+----------------------------+
                                                  |
                                                  v
                               +-------------------------------------+
                               |           STUDENT QUERY             |
                               +-------------------------------------+
                                                  |
                                                  v
                               +-------------------------------------+
                               |       ON-DEVICE SAFETY FILTER       |
                               |  - Danger / Harm prevention (<2ms)  |
                               |  - Academic integrity / Cheating    |
                               |  - Profanity & Off-topic filter     |
                               +-------------------------------------+
                                        |                   |
                                    [Unsafe]             [Safe]
                                        |                   |
                                        v                   v
                             +-------------------+  +-------------------------------------+
                             | Safe Educational  |  |           LOCAL RAG ENGINE          |
                             | Guardrail Notice  |  |  - Inverted Index / BM25 Search     |
                             +-------------------+  |  - Chapter Chunk Ranking            |
                                                    |  - Educational Prompt Assembler     |
                                                    +-------------------------------------+
                                                                    |
                                                                    v
                                                    +-------------------------------------+
                                                    |        ON-DEVICE QUANTIZED SLM      |
                                                    |  - SmolLM-135M / 360M (INT4 Q4_K_M) |
                                                    |  - Footprint: 72.4 MB               |
                                                    |  - Runtime RSS: ~145 MB             |
                                                    |  - Octa-Core Cortex-A53 Acceleration|
                                                    +-------------------------------------+
                                                                    |
                                                                    v
                                                    +-------------------------------------+
                                                    |       STEP-BY-STEP TUTOR ANSWER     |
                                                    |  - Step 1: Core Definition          |
                                                    |  - Step 2: Formulas & Derivations   |
                                                    |  - Step 3: Real Example / Units     |
                                                    |  - Final Takeaway                   |
                                                    +-------------------------------------+
                                                                    |
                                                                    v
                                                    +-------------------------------------+
                                                    |        FOLLOW-UP ACTIONS            |
                                                    | [Explain Simply] [Example]          |
                                                    | [Practice] [Quiz] [Ask Follow-up]   |
                                                    +-------------------------------------+
```

---

## 3. Component Breakdown

### 3.1 Android Native Architecture (`android/`)
Following Google's clean architecture guidelines and Section 7 of the specification:
```text
android/
├── ui/              # Jetpack Compose UI (HomeScreen, ChatScreen, ModuleScreen, PracticeScreen, QuizScreen, etc.)
├── model/           # Kotlin Data classes (Message, CurriculumModule, QuizQuestion, DevicePerformance)
├── inference/       # On-device Quantized SLM inference wrapper with token streaming
├── rag/             # Local BM25 inverted index retriever and prompt builder
├── safety/          # Local regex pattern-matcher and safety validator
├── modules/         # Module repository manager, download handler, and storage verifier
├── database/        # Local SQLite / Room DB for offline persistence
├── profile/         # Student profile preferences (Grade, Language, Progress)
├── quiz/            # 5-question curriculum quiz generator and diagnostic scorer
└── progress/        # Subject mastery tracking and learning analytics
```

### 3.2 Modular Curriculum System (`modules/`)
Rather than shipping a bloated app containing every class and subject, the curriculum is completely decoupled into modular packs:
```text
module/
├── metadata.json           # Pack ID, name, class, subject, version, size
├── curriculum/             # Syllabus definition and learning objectives
├── chapters/               # Core chapter content, formulas, derivations
├── examples/               # Worked numerical problems with steps
├── exercises/              # Practice MCQs with hints & explanations
├── quizzes/                # 5-question diagnostic assessments
└── embeddings/index/       # Inverted index, document lengths, and BM25 term weights
```

Supported Prototype Modules:
1. `class10_math` (Class 10 Mathematics: 72 MB)
2. `class10_science` (Class 10 Science: 81 MB)
3. `class5_math` (Class 5 Mathematics: 45 MB)
4. `bca_cs` (BCA / Computer Science Programming: 65 MB)

### 3.3 On-Device Retrieval-Augmented Generation (Local RAG)
Cloud RAG solutions depend on external vector databases (Pinecone, Milvus, Weaviate) and cloud embeddings. Guru Offline implements a **zero-cloud BM25 retrieval engine**:
- **Term Weighting:** Probabilistic BM25 with $k_1 = 1.5, b = 0.75$.
- **Index Footprint:** Under 150 KB per curriculum module.
- **Latency:** Less than **5 milliseconds** on low-end ARM Cortex-A53 cores.
- **RAM Overhead:** Less than 5 MB in memory.

### 3.4 Quantized SLM Selection & Runtime
To ensure zero Out-Of-Memory (OOM) crashes on a 2GB RAM budget phone:
- **Selected Model:** `SmolLM-135M` or `SmolLM-360M`.
- **Quantization:** `INT4 (Q4_K_M)` via GGUF / ONNX Runtime Mobile.
- **Storage Size:** **72.4 MB**.
- **Active Memory Footprint:** **~145 MB** (Weights + KV Cache + Activations).
- **Inference Speed:** **16.5 tokens/sec** on 4 Cortex-A53 cores.

---

## 4. Privacy & Data Sovereignity
- **No Remote Telemetry:** Normal learning, queries, and student chat logs are never transmitted over the internet.
- **Local Persistence:** All progress, quiz scores, and weak-topic diagnostics remain encrypted in local SQLite storage on the student's device.
- **Airplane-Mode Operability:** Complete functionality is maintained with both Wi-Fi and Cellular radios switched off.
