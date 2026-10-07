package com.guruoffline.app.quiz

import com.guruoffline.app.model.PracticeQuestion
import com.guruoffline.app.model.QuizQuestion
import com.guruoffline.app.model.QuizResult

class QuizEngine {

    fun getSampleQuiz(moduleId: String): List<QuizQuestion> {
        return listOf(
            QuizQuestion(
                qId = 1,
                topic = "Force and Motion",
                question = "Which law gives the quantitative formula F = m × a?",
                options = listOf("A) First Law", "B) Second Law", "C) Third Law", "D) Law of Gravity"),
                correct = "B",
                explanation = "Newton's Second Law defines force as the rate of change of momentum (F = m × a)."
            ),
            QuizQuestion(
                qId = 2,
                topic = "Electricity",
                question = "What is the unit of electric resistance?",
                options = listOf("A) Volt", "B) Ampere", "C) Ohm", "D) Watt"),
                correct = "C",
                explanation = "Resistance is measured in Ohms (Ω) according to Ohm's Law (V = IR)."
            ),
            QuizQuestion(
                qId = 3,
                topic = "Optics",
                question = "What type of mirror is used in vehicles for rear view?",
                options = listOf("A) Concave", "B) Convex", "C) Plane", "D) Parabolic"),
                correct = "B",
                explanation = "Convex mirrors produce virtual, erect, diminished images with a wider field of view."
            ),
            QuizQuestion(
                qId = 4,
                topic = "Acids and Bases",
                question = "What is the pH of pure neutral water at 25°C?",
                options = listOf("A) 0", "B) 7", "C) 14", "D) 1"),
                correct = "B",
                explanation = "A pH of 7 represents a completely neutral solution."
            ),
            QuizQuestion(
                qId = 5,
                topic = "Life Processes",
                question = "Where does aerobic breakdown of glucose into ATP take place?",
                options = listOf("A) Cytoplasm", "B) Mitochondria", "C) Chloroplast", "D) Ribosome"),
                correct = "B",
                explanation = "Aerobic cellular respiration occurs within the mitochondria."
            )
        )
    }

    fun evaluateQuiz(
        questions: List<QuizQuestion>,
        userAnswers: Map<Int, String>
    ): QuizResult {
        var score = 0
        val strong = mutableListOf<String>()
        val weak = mutableListOf<String>()

        questions.forEach { q ->
            val ans = userAnswers[q.qId]
            if (ans == q.correct) {
                score++
                strong.add(q.topic)
            } else {
                weak.add(q.topic)
            }
        }

        return QuizResult(
            quizTitle = "Curriculum Assessment",
            totalQuestions = questions.size,
            correctAnswers = score,
            strongTopics = strong.distinct(),
            weakTopics = weak.distinct()
        )
    }

    fun getSamplePractice(moduleId: String): PracticeQuestion {
        return PracticeQuestion(
            id = "PR-01",
            topic = "Speed, Distance & Time",
            question = "A car travels at 20 m/s for 5 seconds. What distance does it travel?",
            options = listOf("A) 50 m", "B) 100 m", "C) 150 m", "D) 200 m"),
            correctOption = "B",
            explanation = "Distance = Speed × Time = 20 m/s × 5 s = 100 meters."
        )
    }
}
