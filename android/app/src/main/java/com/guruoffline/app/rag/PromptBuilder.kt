package com.guruoffline.app.rag

class PromptBuilder {

    fun buildTutorPrompt(
        subjectName: String,
        gradeLevel: String,
        studentQuery: String,
        retrievedChunks: List<DocumentChunk>,
        mode: String = "normal"
    ): String {
        val context = retrievedChunks.joinToString("\n\n") {
            "[Topic: ${it.topic}]\n${it.content}"
        }

        val modeDirective = when (mode) {
            "simpler" -> "Explain this concept in very simple words with an everyday shopping or sports analogy."
            "example" -> "Provide a concrete real-life numerical example with step-by-step calculation."
            "practice" -> "Generate a multiple-choice practice question based on this topic with options A, B, C, D."
            else -> "Explain step by step with Step 1, Step 2, key formula, and final takeaway."
        }

        return """
            SYSTEM: You are Guru, an empathetic on-device AI teacher for $subjectName (Class $gradeLevel).
            Ground your response strictly on this curriculum context:
            
            CURRICULUM CONTEXT:
            $context
            
            STUDENT QUESTION:
            $studentQuery
            
            TASK:
            $modeDirective
        """.trimIndent()
    }
}
