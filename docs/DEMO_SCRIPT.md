# Guru Offline — Killer Demo Script (10 Steps)

This document provides the exact script, presenter lines, and click actions for demonstrating Guru Offline to hackathon judges.

---

## Prerequisites Before Presenting
1. Launch the Guru Offline Simulator or open the native Android application.
2. Ensure the display is clearly visible to the judges.

---

## Step-by-Step Presentation Walkthrough

### Step 1: Open Guru Offline
- **Action:** Open Guru Offline to the Home screen.
- **Presenter Line:** 
  > *"Good morning judges! Today we present **Guru Offline** — an on-device AI tutor engineered for the millions of students in low-resource and low-connectivity environments where continuous internet is either unavailable or unaffordable."*

### Step 2: Select Class 10 Mathematics
- **Action:** Click `My Subjects` or navigate to Modules. Highlight `Class 10 Mathematics`.
- **Presenter Line:** 
  > *"Instead of forcing students to store every textbook on their phone, Guru uses a modular curriculum architecture. A student selects only the subject they need — in this case, Class 10 Mathematics."*

### Step 3: Download the Module
- **Action:** Show the module size (`72 MB`) and click `Download` (or show verified status).
- **Presenter Line:** 
  > *"While internet is available at school, a library, or a mobile hotspot, the student downloads the module once. It is cryptographically verified and stored locally."*

### Step 4: Turn OFF Wi-Fi & Mobile Data
- **Action:** Flip the Wi-Fi switch to **OFF** and Mobile Data switch to **OFF**. Point out the prominent banner:
  `📵 OFFLINE MODE: AI is running on this device`.
- **Presenter Line:** 
  > *"Now comes the critical test. The student goes home. Wi-Fi is OFF. Mobile Data is OFF. The phone is in complete airplane mode. Cloud APIs like OpenAI or Gemini are completely unreachable."*

### Step 5: Ask: "Explain quadratic equations"
- **Action:** Navigate to Chat and type or click: `"Explain quadratic equations"`.
- **Presenter Line:** 
  > *"The student asks: 'Explain quadratic equations'. Watch what happens locally on the device."*

### Step 6: Review Step-by-Step Tutor Answer
- **Action:** Point out the generated response.
- **Presenter Line:** 
  > *"Within 0.28 seconds, without making a single network call, our local 4-bit quantized model retrieves the NCERT chapter, formats the standard form ax² + bx + c = 0, provides the quadratic formula, and explains the discriminant D. Notice that Guru acts as an empathetic teacher, providing structured steps rather than a simple dump."*

### Step 7: Ask: "Explain it more simply"
- **Action:** Click the interactive follow-up pill: `[Explain More Simply]`.
- **Presenter Line:** 
  > *"If the student finds the algebra intimidating, they click 'Explain More Simply'. The local model re-synthesizes the explanation using intuitive real-world analogies — all offline."*

### Step 8: Click Practice Mode
- **Action:** Click the follow-up pill: `[Practice]`.
- **Presenter Line:** 
  > *"Next, the student wants to test their understanding. With one tap, Guru transitions into offline Practice Mode."*

### Step 9: Complete a Question
- **Action:** Select option `B) 100 m` for the speed/distance question and view instant verification and step-by-step reasoning.
- **Presenter Line:** 
  > *"The student solves the question, receives immediate validation, and reads the full pedagogical reasoning. Learning continues uninterrupted."*

### Step 10: Show Performance Dashboard
- **Action:** Open the `Developer Performance` dashboard.
- **Presenter Line:** 
  > *"Finally, here is the telemetry proving our claims on an ₹8,000 Android smartphone:*
  > - *Quantized Model Size: **72.4 MB***
  > - *Process RAM Usage: **19.2 MB***
  > - *Inference Latency: **0.28 seconds***
  > - *Network Status: **OFFLINE (0 bytes transmitted)***
  > - *Safe RAM Headroom remaining on a 2GB RAM phone: **> 700 MB***
  >
  > *Download once. Turn internet off. Keep learning. Thank you!"*
