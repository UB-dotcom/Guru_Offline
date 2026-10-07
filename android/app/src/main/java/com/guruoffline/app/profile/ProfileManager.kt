package com.guruoffline.app.profile

import com.guruoffline.app.model.StudentProfile

class ProfileManager {
    private var currentProfile = StudentProfile(
        studentName = "Aarav",
        language = "hi",
        board = "CBSE",
        state = null,
        classLevel = 10,
        stream = null,
        selectedSubjects = listOf("mathematics", "science"),
        downloadedModules = listOf("class10_math"),
        gradeLevel = 10,
        activeModuleId = "class10_math",
        preferredLanguage = "Hindi",
        questionsAnsweredCount = 64,
        quizzesCompletedCount = 12,
        currentStreakDays = 5
    )

    fun getProfile(): StudentProfile = currentProfile

    fun updateLanguage(language: String) {
        currentProfile = currentProfile.copy(language = language, preferredLanguage = language)
    }

    fun updateBoard(board: String) {
        currentProfile = currentProfile.copy(
            board = board,
            state = if (board == "STATE") currentProfile.state ?: "bihar" else null
        )
    }

    fun updateState(state: String?) {
        currentProfile = currentProfile.copy(state = state)
    }

    fun updateClassLevel(classLevel: Int) {
        currentProfile = currentProfile.copy(
            classLevel = classLevel,
            gradeLevel = classLevel,
            stream = if (classLevel >= 11) (currentProfile.stream ?: "science") else null
        )
    }

    fun updateStream(stream: String?) {
        currentProfile = currentProfile.copy(stream = stream)
    }

    fun updateSubjects(subjects: List<String>) {
        currentProfile = currentProfile.copy(selectedSubjects = subjects)
    }

    fun addDownloadedModule(moduleId: String) {
        if (!currentProfile.downloadedModules.contains(moduleId)) {
            currentProfile = currentProfile.copy(
                downloadedModules = currentProfile.downloadedModules + moduleId
            )
        }
    }

    fun updateGrade(grade: Int) {
        updateClassLevel(grade)
    }

    fun updateSubject(moduleId: String) {
        currentProfile = currentProfile.copy(activeModuleId = moduleId)
    }
}
