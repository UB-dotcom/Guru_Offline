# React Native Frontend Integration Contract for OfflineTutorAI

This document defines the clean API service contract between the React Native mobile app frontend and the `OfflineTutorAI` backend module.

---

## 🏗️ Architecture & Service Boundaries

The backend strictly separates **ONLINE SYNC SERVICES** from **OFFLINE TUTOR SERVICES**:

```
ONLINE SYNC SERVICES (Run when device has internet)
┌─────────────────────────────────────────────────────────────┐
│ 1. GET /api/curricula/published                            │
│ 2. POST /api/student/profile                                │
│ 3. POST /api/student/sync                                   │
└──────────────────────────────┬──────────────────────────────┘
                               │ Downloads portable bundle
                               ▼
OFFLINE TUTOR SERVICES (Run 100% OFFLINE on device)
┌─────────────────────────────────────────────────────────────┐
│ 1. POST /api/tutor/ask (Local FTS5 RAG + Local SLM)         │
│ 2. GET /api/student/local_packages                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌐 1. ONLINE SYNC SERVICES

### A. List Published Curricula
- **Endpoint**: `GET /api/curricula/published`
- **Response**:
```json
[
  {
    "id": "general-class7-science",
    "board": "General",
    "class_level": "Class 7",
    "subject": "Science",
    "name": "General Class 7 Science",
    "version": "1.0",
    "status": "PUBLISHED",
    "source_file": "general-class7-science_v1.0.pdf",
    "created_at": "2026-10-07 19:30:00",
    "updated_at": "2026-10-07 19:30:00"
  }
]
```

### B. Register Student Academic Profile
- **Endpoint**: `POST /api/student/profile`
- **Payload**:
```json
{
  "student_id": "student_101",
  "name": "Alex",
  "board": "General",
  "class_level": "Class 7",
  "selected_subjects": ["Science", "Mathematics"],
  "language_preference": "en"
}
```
- **Response**:
```json
{
  "student_id": "student_101",
  "name": "Alex",
  "board": "General",
  "class_level": "Class 7",
  "selected_subjects": ["Science", "Mathematics"],
  "resolved_curricula": [
    {
      "id": "general-class7-science",
      "board": "General",
      "class_level": "Class 7",
      "subject": "Science",
      "version": "1.0",
      "status": "PUBLISHED"
    }
  ]
}
```

### C. Synchronize / Download Curriculum Package
- **Endpoint**: `POST /api/student/sync`
- **Payload**:
```json
{
  "curriculum_id": "general-class7-science"
}
```
- **Response**:
```json
{
  "sync_status": "SUCCESS",
  "curriculum_id": "general-class7-science",
  "version": "1.0",
  "local_path": "/data/user/0/com.app/files/curriculum_packages/general-class7-science",
  "manifest": {
    "curriculum_id": "general-class7-science",
    "board": "General",
    "class_level": "Class 7",
    "subject": "Science",
    "version": "1.0",
    "chunk_count": 13
  }
}
```

---

## 📴 2. OFFLINE TUTOR SERVICES (Zero Network Calls)

### A. Ask Tutor Question
- **Endpoint / Local Binding**: `POST /api/tutor/ask` or `NativeModules.OfflineTutorBridge.askTutor(...)`
- **Payload**:
```json
{
  "student_id": "student_101",
  "board": "General",
  "class_level": "Class 7",
  "subject": "Science",
  "question": "Why do plants need sunlight?",
  "conversation_history": [
    {
      "role": "user",
      "content": "Hi, I am studying biology."
    },
    {
      "role": "assistant",
      "content": "Hello! I am your offline AI tutor. What concept can I explain for you today?"
    }
  ],
  "language": "en"
}
```

- **Response Payload**:
```json
{
  "answer": "Based on your curriculum material for **Why do plants need sunlight?**:\n\n- **Key Point**: Nutrition in plants involves using sunlight to synthesize food via photosynthesis.",
  "sources": [
    {
      "board": "General",
      "class": "Class 7",
      "subject": "Science",
      "chapter": "Class 7 Science Core Curriculum",
      "topic": "Biology",
      "source_page": "1",
      "chunk_id": "GEN-7-SCI-CH01-TP07-001"
    }
  ],
  "retrieved_chunks": [
    {
      "id": 7,
      "curriculum_id": "general-class7-science",
      "board": "General",
      "class": "Class 7",
      "subject": "Science",
      "chapter": "Class 7 Science Core Curriculum",
      "topic": "Biology",
      "content": "Nutrition in plants and animals, respiration in organisms, transportation, and reproduction in plants.",
      "source_page": "1",
      "chunk_id": "GEN-7-SCI-CH01-TP07-001",
      "score": 2.8762
    }
  ],
  "safety_status": {
    "is_safe": true,
    "reason": null
  },
  "latency_ms": 12.4
}
```

---

## 💡 React Native Code Example (`TutorClient.ts`)

```typescript
import axios from 'axios';

export interface AskTutorParams {
  studentId: string;
  board: string;
  classLevel: string;
  subject: string;
  question: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

export async function askOfflineTutor(params: AskTutorParams) {
  // Bound to local background microservice 127.0.0.1 or JSI native module
  const response = await axios.post('http://127.0.0.1:8080/api/tutor/ask', {
    student_id: params.studentId,
    board: params.board,
    class_level: params.classLevel,
    subject: params.subject,
    question: params.question,
    conversation_history: params.conversationHistory || [],
    language: 'en'
  }, { timeout: 30000 });

  return response.data;
}
```
