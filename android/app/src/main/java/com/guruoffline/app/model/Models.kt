package com.guruoffline.app.model

import com.google.gson.annotations.SerializedName

data class Message(
    val id: String = java.util.UUID.randomUUID().toString(),
    val sender: MessageSender,
    val text: String,
    val timestamp: Long = System.currentTimeMillis(),
    val isStreaming: Boolean = false,
    val citations: List<Citation> = emptyList(),
    val actionPills: List<String> = emptyList(),
    val latencyMs: Long = 0L,
    val ramUsageMb: Float = 0f,
    val isOfflineVerified: Boolean = true
)

enum class MessageSender {
    STUDENT,
    GURU_OFFLINE,
    SYSTEM
}

data class Citation(
    val title: String,
    val chapter: String,
    val confidenceScore: Float
)

data class CurriculumModule(
    @SerializedName("module_id") val id: String,
    val name: String,
    @SerializedName("class") val classLevel: String,
    val subject: String,
    val language: String = "English",
    val version: String = "1.0",
    @SerializedName("size_mb") val sizeMb: Int,
    val author: String = "NCERT / National Board",
    val topics: List<String> = emptyList(),
    var isInstalled: Boolean = false,
    var downloadProgressPercent: Int = 0
)

data class QuizQuestion(
    @SerializedName("q_id") val qId: Int,
    val topic: String,
    val question: String,
    val options: List<String>,
    val correct: String,
    val explanation: String
)

data class QuizResult(
    val quizTitle: String,
    val totalQuestions: Int,
    val correctAnswers: Int,
    val strongTopics: List<String>,
    val weakTopics: List<String>,
    val timestamp: Long = System.currentTimeMillis()
)

data class PracticeQuestion(
    @SerializedName("exercise_id") val id: String,
    val topic: String,
    val question: String,
    val options: List<String>,
    @SerializedName("correct_option") val correctOption: String,
    val explanation: String
)

data class StudentProfile(
    val studentName: String = "Student",
    val gradeLevel: Int = 10,
    val activeModuleId: String = "class10_math",
    val preferredLanguage: String = "English",
    val questionsAnsweredCount: Int = 0,
    val quizzesCompletedCount: Int = 0,
    val currentStreakDays: Int = 1
)

data class DevicePerformance(
    val modelName: String = "SmolLM-135M-Q4",
    val modelSizeMb: Float = 72.4f,
    val ramRssMb: Float = 145.2f,
    val responseTimeSec: Float = 0.42f,
    val isOffline: Boolean = true,
    val currentModule: String = "Class 10 Mathematics",
    val tokensPerSecond: Float = 16.5f
)
