package com.guruoffline.app.profile

import com.guruoffline.app.model.StudentProfile

class ProfileManager {
    private var currentProfile = StudentProfile(
        studentName = "Aarav",
        gradeLevel = 10,
        activeModuleId = "class10_math",
        preferredLanguage = "English",
        questionsAnsweredCount = 64,
        quizzesCompletedCount = 12,
        currentStreakDays = 5
    )

    fun getProfile(): StudentProfile = currentProfile

    fun updateGrade(grade: Int) {
        currentProfile = currentProfile.copy(gradeLevel = grade)
    }

    fun updateSubject(moduleId: String) {
        currentProfile = currentProfile.copy(activeModuleId = moduleId)
    }
}
