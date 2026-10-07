package com.guruoffline.app.modules

import com.google.gson.Gson
import com.guruoffline.app.model.CurriculumModule
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import java.io.File

class ModuleManager(private val baseDir: File) {

    private val availableModules = mutableListOf(
        CurriculumModule(
            id = "class10_math",
            name = "Class 10 Mathematics",
            classLevel = "10",
            subject = "Mathematics",
            sizeMb = 72,
            topics = listOf("Real Numbers", "Quadratic Equations", "Arithmetic Progressions", "Trigonometry", "Coordinate Geometry"),
            isInstalled = true
        ),
        CurriculumModule(
            id = "class10_science",
            name = "Class 10 Science",
            classLevel = "10",
            subject = "Science",
            sizeMb = 81,
            topics = listOf("Chemical Reactions", "Acids and Bases", "Life Processes", "Light", "Electricity", "Newton's Laws"),
            isInstalled = true
        ),
        CurriculumModule(
            id = "class5_math",
            name = "Class 5 Mathematics",
            classLevel = "5",
            subject = "Mathematics",
            sizeMb = 45,
            topics = listOf("Large Numbers", "Fractions", "Shapes & Angles", "Perimeter & Area", "Speed Distance Time"),
            isInstalled = false
        ),
        CurriculumModule(
            id = "bca_cs",
            name = "BCA / CS Programming",
            classLevel = "College/BCA",
            subject = "Computer Science",
            sizeMb = 65,
            topics = listOf("Python Basics", "OOP Concepts", "Stacks & Queues", "Search & Sort Algorithms"),
            isInstalled = false
        )
    )

    fun getModules(): List<CurriculumModule> = availableModules.toList()

    fun getInstalledModules(): List<CurriculumModule> = availableModules.filter { it.isInstalled }

    fun downloadModule(moduleId: String): Flow<Int> = flow {
        val target = availableModules.find { it.id == moduleId } ?: return@flow
        for (progress in 10..100 step 15) {
            target.downloadProgressPercent = progress
            emit(progress)
            delay(120L)
        }
        target.isInstalled = true
        target.downloadProgressPercent = 100
        emit(100)
    }

    fun isModuleReadyOffline(moduleId: String): Boolean {
        return availableModules.find { it.id == moduleId }?.isInstalled == true
    }
}
