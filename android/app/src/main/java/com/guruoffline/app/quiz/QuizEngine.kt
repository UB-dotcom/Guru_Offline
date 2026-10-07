package com.guruoffline.app.quiz

import com.guruoffline.app.model.PracticeQuestion
import com.guruoffline.app.model.QuizQuestion
import com.guruoffline.app.model.QuizResult

class QuizEngine {

    fun getSampleQuiz(moduleId: String = "class10_math"): List<QuizQuestion> {
        if (moduleId.contains("math") || moduleId.contains("quadratic")) {
            return getQuadraticEquationsQuiz()
        }
        return getScienceQuiz()
    }

    fun getQuadraticEquationsQuiz(): List<QuizQuestion> {
        return listOf(
            QuizQuestion(
                qId = 1,
                topic = "Quadratic Equations - Standard Form",
                question = "What is the standard form of a quadratic equation in one variable x?",
                options = listOf("A) ax + b = 0", "B) ax² + bx + c = 0 (where a ≠ 0)", "C) ax³ + bx² + c = 0", "D) ax² + bx = 0"),
                correct = "B",
                explanation = "A quadratic equation in variable x is an equation of the form ax² + bx + c = 0, where a, b, c are real numbers and a ≠ 0 (NCERT Class 10 Math, Chapter 4).",
                board = "CBSE",
                classLevel = 10,
                subject = "mathematics",
                language = "hi",
                difficulty = "easy"
            ),
            QuizQuestion(
                qId = 2,
                topic = "Quadratic Equations - Discriminant",
                question = "What is the formula for the discriminant (D) of ax² + bx + c = 0?",
                options = listOf("A) D = b² + 4ac", "B) D = b² - 4ac", "C) D = 2a - 4bc", "D) D = b - 4ac"),
                correct = "B",
                explanation = "The discriminant D is defined as D = b² - 4ac. If D > 0, there are two distinct real roots; if D = 0, two equal real roots; if D < 0, no real roots.",
                board = "CBSE",
                classLevel = 10,
                subject = "mathematics",
                language = "hi",
                difficulty = "easy"
            ),
            QuizQuestion(
                qId = 3,
                topic = "Quadratic Equations - Nature of Roots",
                question = "If the discriminant D = b² - 4ac is equal to 0, what can be said about the roots?",
                options = listOf("A) Two distinct real roots", "B) Two equal real roots (roots are -b/2a)", "C) No real roots", "D) Imaginary roots only"),
                correct = "B",
                explanation = "When D = 0, both roots are real and identical: x = -b / (2a).",
                board = "CBSE",
                classLevel = 10,
                subject = "mathematics",
                language = "hi",
                difficulty = "medium"
            ),
            QuizQuestion(
                qId = 4,
                topic = "Quadratic Equations - Quadratic Formula",
                question = "According to Sridharacharya's quadratic formula, roots are given by:",
                options = listOf("A) x = (-b ± √(b² - 4ac)) / (2a)", "B) x = (-b ± √(b² + 4ac)) / (2a)", "C) x = (b ± √(b² - 4ac)) / (2a)", "D) x = (-b ± √(b² - 4ac)) / a"),
                correct = "A",
                explanation = "The quadratic formula states that x = (-b ± √(b² - 4ac)) / (2a).",
                board = "CBSE",
                classLevel = 10,
                subject = "mathematics",
                language = "hi",
                difficulty = "medium"
            ),
            QuizQuestion(
                qId = 5,
                topic = "Quadratic Equations - Roots Calculation",
                question = "What are the roots of the equation x² - 5x + 6 = 0?",
                options = listOf("A) x = 2 and x = 3", "B) x = -2 and x = -3", "C) x = 1 and x = 6", "D) x = -1 and x = -6"),
                correct = "A",
                explanation = "Factoring: (x - 2)(x - 3) = 0 gives x = 2 and x = 3. Checking: 2 + 3 = 5 (-b/a) and 2 × 3 = 6 (c/a).",
                board = "CBSE",
                classLevel = 10,
                subject = "mathematics",
                language = "hi",
                difficulty = "hard"
            )
        )
    }

    fun getScienceQuiz(): List<QuizQuestion> {
        return listOf(
            QuizQuestion(
                qId = 1,
                topic = "Force and Motion",
                question = "Which law gives the quantitative formula F = m × a?",
                options = listOf("A) First Law", "B) Second Law", "C) Third Law", "D) Law of Gravity"),
                correct = "B",
                explanation = "Newton's Second Law defines force as the rate of change of momentum (F = m × a).",
                board = "CBSE",
                classLevel = 10,
                subject = "science",
                language = "en",
                difficulty = "easy"
            ),
            QuizQuestion(
                qId = 2,
                topic = "Electricity",
                question = "What is the unit of electric resistance?",
                options = listOf("A) Volt", "B) Ampere", "C) Ohm", "D) Watt"),
                correct = "C",
                explanation = "Resistance is measured in Ohms (Ω) according to Ohm's Law (V = IR).",
                board = "CBSE",
                classLevel = 10,
                subject = "science",
                language = "en",
                difficulty = "easy"
            ),
            QuizQuestion(
                qId = 3,
                topic = "Optics",
                question = "What type of mirror is used in vehicles for rear view?",
                options = listOf("A) Concave", "B) Convex", "C) Plane", "D) Parabolic"),
                correct = "B",
                explanation = "Convex mirrors produce virtual, erect, diminished images with a wider field of view.",
                board = "CBSE",
                classLevel = 10,
                subject = "science",
                language = "en",
                difficulty = "easy"
            ),
            QuizQuestion(
                qId = 4,
                topic = "Acids and Bases",
                question = "What is the pH of pure neutral water at 25°C?",
                options = listOf("A) 0", "B) 7", "C) 14", "D) 1"),
                correct = "B",
                explanation = "A pH of 7 represents a completely neutral solution.",
                board = "CBSE",
                classLevel = 10,
                subject = "science",
                language = "en",
                difficulty = "easy"
            ),
            QuizQuestion(
                qId = 5,
                topic = "Life Processes",
                question = "Where does aerobic breakdown of glucose into ATP take place?",
                options = listOf("A) Cytoplasm", "B) Mitochondria", "C) Chloroplast", "D) Ribosome"),
                correct = "B",
                explanation = "Aerobic cellular respiration occurs within the mitochondria.",
                board = "CBSE",
                classLevel = 10,
                subject = "science",
                language = "en",
                difficulty = "easy"
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

    fun getSamplePractice(moduleId: String = "class10_math", difficulty: String = "easy"): PracticeQuestion {
        if (moduleId.contains("math") || moduleId.contains("quadratic")) {
            return if (difficulty == "hard") {
                PracticeQuestion(
                    id = "PR-MATH-02",
                    topic = "Quadratic Equations - Word Problem",
                    question = "The sum of a number and its reciprocal is 10/3. Find the number.",
                    options = listOf("A) 2 or 1/2", "B) 3 or 1/3", "C) 4 or 1/4", "D) 5 or 1/5"),
                    correctOption = "B",
                    explanation = "Let the number be x. x + 1/x = 10/3 => (x² + 1)/x = 10/3 => 3x² - 10x + 3 = 0. (3x - 1)(x - 3) = 0 => x = 3 or 1/3.",
                    board = "CBSE",
                    classLevel = 10,
                    subject = "mathematics",
                    language = "hi",
                    difficulty = "hard"
                )
            } else {
                PracticeQuestion(
                    id = "PR-MATH-01",
                    topic = "Quadratic Equations - Discriminant",
                    question = "Find the discriminant of the quadratic equation 2x² - 4x + 3 = 0 and determine the nature of its roots.",
                    options = listOf("A) D = 8 (2 distinct roots)", "B) D = 0 (2 equal roots)", "C) D = -8 (no real roots)", "D) D = 4 (2 real roots)"),
                    correctOption = "C",
                    explanation = "Here a = 2, b = -4, c = 3. Discriminant D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8. Since D < 0, there are no real roots.",
                    board = "CBSE",
                    classLevel = 10,
                    subject = "mathematics",
                    language = "hi",
                    difficulty = "easy"
                )
            }
        }
        return PracticeQuestion(
            id = "PR-01",
            topic = "Speed, Distance & Time",
            question = "A car travels at 20 m/s for 5 seconds. What distance does it travel?",
            options = listOf("A) 50 m", "B) 100 m", "C) 150 m", "D) 200 m"),
            correctOption = "B",
            explanation = "Distance = Speed × Time = 20 m/s × 5 s = 100 meters.",
            board = "CBSE",
            classLevel = 10,
            subject = "science",
            language = "en",
            difficulty = "easy"
        )
    }
}
