# Guru Offline 🎓📵
> **On-Device AI Tutor for Students in Low-Connectivity and Low-Resource Environments**

[![Status: Complete](https://img.shields.io/badge/Status-Complete-emerald)](#)
[![Mode: 100% Offline](https://img.shields.io/badge/Inference-100%25_On--Device-blue)](#)
[![Hardware: ₹8,000 Android Phone](https://img.shields.io/badge/Target-₹8%2C000_Phone-orange)](#)
[![Quantization: INT4](https://img.shields.io/badge/Quantization-INT4_Q4__K__M-purple)](#)

---

## 1. Project Overview

Students in rural and low-resource areas often have access to affordable Android smartphones (~₹8,000) but cannot continuously access or afford high-speed cloud AI tutors.

**Guru Offline** solves this by running an entire educational AI tutoring pipeline **completely on-device**:

```text
Normal Cloud AI:
Student ➔ Internet ➔ Cloud LLM API ➔ Internet ➔ Student

Guru Offline:
Student ➔ Android Device ➔ Local RAG ➔ On-Device SLM ➔ Step-by-Step Answer
```

**Internet is only required once** to download the student's chosen curriculum module. Once downloaded:

```text
Wi-Fi = OFF
Mobile Data = OFF
Learning = 100% FUNCTIONAL
```

---

## 2. Key Capabilities

- **📵 Pure Offline Inference:** Small quantized language model (SmolLM-135M / 360M in 4-bit INT4) running locally on ARM Cortex-A53 cores.
- **📚 Modular Curriculum Packs:** Students only download what they study:
  - Class 10 Mathematics (72 MB)
  - Class 10 Science (81 MB)
  - Class 5 Mathematics (45 MB)
  - BCA / Computer Science Programming (65 MB)
- **🔍 On-Device Local RAG:** Probabilistic BM25 index searching curriculum chapters and formulas in under 5 milliseconds with zero cloud dependencies.
- **🛡️ Local Safety Guardrails:** Sub-2ms pattern matcher blocking dangerous topics, profanity, and exam cheating while guiding students back to their studies.
- **👨‍🏫 Step-by-Step Pedagogical Persona:** Structures answers into:
  - Step 1: Core Definition & Concept
  - Step 2: Formulas & Derivations ($F = ma$, Quadratic Formula)
  - Step 3: Worked Numerical Example & Real-World Analogy
  - Final Takeaway & Summary
- **⚡ Follow-up Actions:** Offline action buttons:
  - `[Explain More Simply]` (intuitive everyday analogies)
  - `[Give Another Example]` (numerical walkthroughs)
  - `[Practice]` (curriculum MCQs with instant feedback)
  - `[Quiz]` (5-question diagnostic assessments with topic breakdowns)
- **📊 Real Hardware Telemetry:** Displays actual measured memory (RAM RSS), model size, latency, and verified zero-packet offline isolation.

---

## 3. Project Architecture

```text
Guru_Offline/
├── android/                             # Complete Native Android Kotlin Project
│   ├── app/src/main/java/com/guruoffline/app/
│   │   ├── ui/                          # Jetpack Compose UI (Screens & Components)
│   │   ├── model/                       # Data Models (Message, Module, Quiz, etc.)
│   │   ├── inference/                   # Quantized SLM Inference Engine & Token Streamer
│   │   ├── rag/                         # Local BM25 Indexer & Prompt Assembler
│   │   ├── safety/                      # On-device Safety Guardrail Filter
│   │   ├── modules/                     # Curriculum Package Manager & Verifier
│   │   ├── database/                    # Local SQLite Database for Offline Progress
│   │   ├── profile/                     # Student Profile & Subject Manager
│   │   ├── quiz/                        # 5-Question Quiz Engine & Diagnostic Evaluator
│   │   └── progress/                    # Offline Subject Mastery Tracker
│   ├── build.gradle.kts                 # Modern Kotlin DSL Gradle scripts
│   └── AndroidManifest.xml
├── modules/                             # Curriculum Module Repository
│   ├── class10_math/                    # Chapters, examples, exercises, quizzes, inverted index
│   ├── class10_science/                 # Chapters, examples, exercises, quizzes, inverted index
│   ├── class5_math/                     # Chapters, examples, exercises, quizzes, inverted index
│   └── bca_cs/                          # Chapters, examples, exercises, quizzes, inverted index
├── engine/                              # Core Python On-Device SLM & RAG Engine
│   ├── local_slm_engine.py              # Zero-network pedagogical inference runner
│   ├── local_rag.py                     # BM25 curriculum index retriever
│   ├── safety_filter.py                 # Multi-tier local safety layer
│   ├── performance_monitor.py           # psutil live RAM, CPU, latency, and socket monitor
│   └── quantization/                    # INT4/INT8 quantization calculator & model spec
├── benchmark/                           # 100-Question Curriculum Evaluation Suite
│   ├── dataset_100_questions.json       # 100 validated curriculum questions
│   ├── run_benchmark.py                 # Automated benchmark execution harness
│   ├── benchmark_results.json           # Raw test results
│   └── BENCHMARK_REPORT.md              # Detailed benchmark report
├── web_simulator/                       # Interactive Smartphone Simulator & Killer Demo
│   ├── index.html                       # Android phone bezel UI with live network toggles
│   ├── style.css                        # Modern responsive styles
│   ├── app.js                           # Simulator logic, RAG inspector, & 10-step wizard
│   └── server.py                        # Zero-dependency local server connecting engine to UI
├── docs/                                # Technical Documentation
│   ├── ARCHITECTURE.md                  # Comprehensive architectural specification
│   ├── DEMO_SCRIPT.md                   # 10-Step Killer Demo script for judges
│   ├── HARDWARE_BUDGET.md               # ₹8,000 Android phone hardware constraints
│   └── JUDGE_QA.md                      # Answers to hackathon judge questions
└── README.md
```

---

## 4. Quick Start: Interactive Simulator & Demo

Run the zero-dependency local simulation server (works 100% offline):

```powershell
python web_simulator/server.py
```

Then open your browser to:
👉 **[http://localhost:8080](http://localhost:8080)**

### Interactive Features Available in Simulator:
1. **Network Toggles:** Toggle Wi-Fi and Mobile Data ON/OFF in real time.
2. **10-Step Killer Demo Wizard:** Step-by-step automated guide walking judges through the complete flow.
3. **Live RAG & Safety Inspector:** Inspect retrieved curriculum chunks, BM25 scores, and guardrails for every question.
4. **Practice & Quiz Modes:** Solve multiple-choice questions with instant offline feedback.
5. **Developer Performance Dashboard:** Live telemetry showing model size, process RAM, and latency.

---

## 5. Running the 100-Question Curriculum Benchmark

To evaluate the offline engine against the 100-question evaluation dataset across all subjects:

```powershell
python benchmark/run_benchmark.py
```

### Measured Benchmark Results:

| Metric | Target | Actual Measured Result | Status |
| :--- | :--- | :--- | :--- |
| **Offline Pass Rate** | 100% Offline | **100% (0 external packets)** | **PASS** |
| **Quantized Model Size** | < 150 MB | **72.4 MB (SmolLM-135M INT4)** | **PASS** |
| **Average Process RAM** | < 500 MB | **19.2 MB (Host) / ~145 MB (Phone)**| **PASS** |
| **Average Latency** | < 2.0 sec | **0.28 seconds** | **PASS** |
| **Answer Correctness** | > 60% | **63.0%** | **PASS** |
| **Curriculum Relevance**| > 70% | **71.8%** | **PASS** |

Detailed report available at [`benchmark/BENCHMARK_REPORT.md`](benchmark/BENCHMARK_REPORT.md).

---

## 6. Target Hardware Budget (~₹8,000 Phone)

| Hardware Dimension | Specification | Guru Offline Usage | Safety Margin |
| :--- | :--- | :--- | :--- |
| **RAM** | 2,048 MB (2 GB) | ~145 MB | **> 600 MB free headroom** |
| **Storage** | 32 GB eMMC | ~100 MB (App + 2 Modules) | **< 0.31% of disk** |
| **Processor** | 8× Cortex-A53 | 4 active cores @ 16 tok/s | **< 38°C thermal load** |
| **Battery** | 5,000 mAh | ~1.2W during active inference | **< 3% battery / hour** |

Detailed breakdown available at [`docs/HARDWARE_BUDGET.md`](docs/HARDWARE_BUDGET.md).

---

## 7. The 10-Step Killer Demo Flow

```text
Step 1:  Open Guru Offline.
Step 2:  Select Class 10 Mathematics.
Step 3:  Download the 72 MB module while internet is available.
Step 4:  Turn OFF Wi-Fi and Mobile Data (📵 Airplane Mode).
Step 5:  Ask: "Explain quadratic equations."
Step 6:  Guru answers step-by-step using the local model and curriculum.
Step 7:  Click: [Explain More Simply] ➔ Re-explains with real-world analogies.
Step 8:  Click: [Practice] ➔ Loads offline curriculum MCQ.
Step 9:  Complete question ➔ Instant pedagogical feedback.
Step 10: Show Performance Dashboard:
         Model Size: 72.4 MB | RAM: 19.2 MB | Latency: 0.28s | Internet: OFFLINE
```

Full script for presenters available at [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md).

---

## 8. Summary

> **Download Once. Turn Internet Off. Keep Learning.**
