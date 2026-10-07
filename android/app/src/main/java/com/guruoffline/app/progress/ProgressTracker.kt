package com.guruoffline.app.progress

data class SubjectProgress(
    val subjectName: String,
    val completedPercentage: Int,
    val questionsAttempted: Int,
    val quizAverage: Int
)

class ProgressTracker {

    private val progressMap = mutableMapOf(
        "Mathematics" to SubjectProgress("Mathematics", 80, 48, 85),
        "Science" to SubjectProgress("Science", 60, 36, 78),
        "Computer Science" to SubjectProgress("Computer Science", 40, 18, 90)
    )

    fun getAllProgress(): List<SubjectProgress> = progressMap.values.toList()

    fun recordAttempt(subject: String, isCorrect: Boolean) {
        val curr = progressMap[subject] ?: SubjectProgress(subject, 10, 0, 0)
        val newAttemptCount = curr.questionsAttempted + 1
        val newPct = minOf(100, curr.completedPercentage + if (isCorrect) 2 else 1)
        progressMap[subject] = curr.copy(
            questionsAttempted = newAttemptCount,
            completedPercentage = newPct
        )
    }
}
