package com.guruoffline.app.rag

class PromptBuilder {

    fun buildTutorPrompt(
        subjectName: String,
        gradeLevel: String,
        studentQuery: String,
        retrievedChunks: List<DocumentChunk>,
        board: String = "CBSE",
        language: String = "Hindi",
        mode: String = "normal"
    ): String {
        val context = if (retrievedChunks.isNotEmpty()) {
            retrievedChunks.joinToString("\n\n") {
                "[Topic: ${it.topic}]\n${it.content}"
            }
        } else {
            "No specific textbook section found for this query within the active curriculum."
        }

        val langDirective = when (language.lowercase()) {
            "hi", "hindi" -> "Explain completely in clear, natural Hindi (हिंदी). Ground scientific and mathematical concepts in NCERT textbook terminology."
            "bilingual", "hinglish" -> "Explain primarily in clear Hindi, keeping key mathematical and scientific terms, formulas, and variable symbols in English (Hinglish/Bilingual)."
            else -> "Explain clearly in English adhering strictly to Indian national curriculum standards."
        }

        val modeDirective = when (mode) {
            "simpler" -> "Explain this concept in very simple, accessible language with an everyday sports, cricket, or market analogy."
            "example" -> "Provide a concrete real-life numerical worked example with step-by-step calculation."
            "practice" -> "Generate a multiple-choice practice question based on this topic with options A, B, C, D."
            else -> "Explain step-by-step with Step 1, Step 2, key formula, and final takeaway."
        }

        return """
            SYSTEM: You are Guru, an empathetic AI tutor running offline without internet.
            CURRICULUM PROFILE:
            • Board: $board
            • Class: $gradeLevel
            • Subject: $subjectName
            • Language: $language
            
            CURRICULUM CONTEXT:
            $context
            
            STUDENT QUESTION:
            $studentQuery
            
            GUIDELINES:
            1. Answer using retrieved curriculum context only. Do not invent curriculum facts.
            2. $langDirective
            3. $modeDirective
            4. Mention chapter or source context when available.
            5. If the question is outside the syllabus of Class $gradeLevel $board $subjectName, politely state that it is outside the current curriculum.
        """.trimIndent()
    }
}
