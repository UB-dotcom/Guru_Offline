# React Native Frontend Integration Guide for OfflineTutorAI

This document explains how the React Native frontend mobile application interfaces with the `OfflineTutorAI` backend module on an offline Android phone.

---

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│               React Native Mobile Frontend                  │
│       (UI, Chat Interface, Subject Selector, Buttons)       │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               │  Bridge Mechanism / Native API │
               └───────────────┬───────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    OfflineTutorAI Module                    │
│                                                             │
│  1. Safety Guard ──► Pre-filtering & injection prevention   │
│  2. SQLite Retriever ──► Local FTS5 curriculum search      │
│  3. Prompt Builder ──► Assembles pedagogical context         │
│  4. Local SLM Engine ──► llama.cpp / ExecuTorch / ONNX      │
│  5. Response Processor ──► Extracts citations & formats answer│
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 Integration Options for React Native

There are two primary ways the React Native app can call the `OfflineTutorAI` engine on Android:

---

### Option A: Local Android Background HTTP Bridge (Recommended for rapid cross-platform dev)

In this approach, an embedded lightweight HTTP micro-service runs locally on the Android device bound strictly to `127.0.0.1` (localhost).

1. **Android App Startup**: The Android app starts a background local service (`TutorBackgroundService.kt`) hosting the Python engine via Chaquopy / Python-for-Android, or a native Kotlin wrapper binding to SQLite and local SLM C++ inference.
2. **Endpoint**: `POST http://127.0.0.1:8080/ask_tutor`
3. **Network Permission**: Zero internet permissions needed (`android.permission.INTERNET` not required for loopback `127.0.0.1`).

#### Sample React Native Call (`api.ts`):

```typescript
import axios from 'axios';

export interface CurriculumSource {
  board: string;
  class: string;
  subject: string;
  chapter: string;
  topic: string;
  source_page: string;
  chunk_id: string;
}

export interface TutorResponse {
  answer: string;
  sources: CurriculumSource[];
  safety_status: {
    is_safe: boolean;
    reason: string | null;
  };
  latency_ms: number;
}

export async function askTutor(
  question: string,
  subject?: string,
  language: string = 'en',
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<TutorResponse> {
  try {
    const response = await axios.post<TutorResponse>(
      'http://127.0.0.1:8080/ask_tutor',
      {
        question,
        subject,
        language,
        conversation_history: conversationHistory,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to communicate with local tutor service:', error);
    throw error;
  }
}
```

---

### Option B: Native C++/JSI Direct Module Bridge (Recommended for max performance)

Using React Native JSI (JavaScript Interface) or Native Modules (`NativeModules.OfflineTutorBridge`), the frontend invokes C++ bindings of `llama.cpp` + `SQLite3`.

#### 1. Android Asset Deployment
- **Curriculum Database**: Copy `curriculum.db` into Android project `assets/curriculum.db`. On first startup, copy it to app internal storage (`/data/user/0/com.app/files/curriculum.db`).
- **SLM Model Weights**: Download GGUF model file (e.g. `phi-3-mini-4k-instruct-q4.gguf`) during initial app installation or bundle in app assets.

#### 2. React Native Native Module Definition (`OfflineTutorBridge.ts`):

```typescript
import { NativeModules } from 'react-native';

const { OfflineTutorBridge } = NativeModules;

export interface TutorRequestPayload {
  question: string;
  subject?: string;
  language?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

export async function askTutorNative(payload: TutorRequestPayload) {
  return await OfflineTutorBridge.askTutor(
    payload.question,
    payload.subject || '',
    payload.language || 'en',
    JSON.stringify(payload.conversationHistory || [])
  );
}
```

---

## 📥 Input API Signature & Payload

The service accepts:

```typescript
ask_tutor(question, subject, language, conversation_history)
```

### Example Request Body (JSON):

```json
{
  "question": "What is Snell's Law of refraction?",
  "subject": "Science",
  "language": "en",
  "conversation_history": [
    {
      "role": "user",
      "content": "Hi, I am studying Class 10 Physics."
    },
    {
      "role": "assistant",
      "content": "Hello! I am your AI Tutor. What concept would you like to explore today?"
    }
  ]
}
```

---

## 📤 Output Response Payload

The service returns a structured response object:

```json
{
  "answer": "Based on your curriculum material for **What is Snell's Law of refraction?**:\n\n- **Key Point**: Laws of refraction: (i) The incident ray, the refracted ray and the normal to the interface... (ii) The ratio of sine of angle of incidence to the sine of angle of refraction is a constant (n = sin i / sin r). This is known as Snell's law.",
  "sources": [
    {
      "board": "CBSE",
      "class": "Class 10",
      "subject": "Science",
      "chapter": "Light - Reflection and Refraction",
      "topic": "Refraction of Light and Snell's Law",
      "source_page": "171",
      "chunk_id": "CBSE-10-SCI-CH10-TP02-001"
    }
  ],
  "retrieved_chunks": [
    {
      "id": 2,
      "board": "CBSE",
      "class": "Class 10",
      "subject": "Science",
      "chapter": "Light - Reflection and Refraction",
      "topic": "Refraction of Light and Snell's Law",
      "content": "Light does not travel in the same direction in all media...",
      "source_page": "171",
      "chunk_id": "CBSE-10-SCI-CH10-TP02-001",
      "score": 1.8639
    }
  ],
  "safety_status": {
    "is_safe": true,
    "reason": null
  },
  "latency_ms": 42.15
}
```

---

## 🎨 Recommended UI Display Patterns

1. **Source Citation Pills**: Render `sources[i].chapter` and `Page ${sources[i].source_page}` as clickable chips below the answer.
2. **Safety Handling**: If `safety_status.is_safe` is `false`, display `answer` text in an informational banner explaining that the app is dedicated to curriculum tutoring.
3. **Offline Status Badge**: Show an **"Offline Intelligence Active"** indicator in the UI header to reassure students that no internet connection is required.
