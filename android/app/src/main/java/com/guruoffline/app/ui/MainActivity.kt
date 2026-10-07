package com.guruoffline.app.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import com.guruoffline.app.ui.screens.*
import com.guruoffline.app.ui.theme.GuruOfflineTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            GuruOfflineTheme {
                var currentScreen by remember { mutableStateOf("home") }

                when (currentScreen) {
                    "home" -> HomeScreen(
                        onNavigateToChat = { currentScreen = "chat" },
                        onNavigateToModules = { currentScreen = "modules" },
                        onNavigateToPractice = { currentScreen = "practice" },
                        onNavigateToQuiz = { currentScreen = "quiz" },
                        onNavigateToProgress = { currentScreen = "progress" },
                        onNavigateToPerformance = { currentScreen = "performance" }
                    )
                    "chat" -> ChatScreen(
                        onBack = { currentScreen = "home" },
                        onNavigateToPractice = { currentScreen = "practice" },
                        onNavigateToQuiz = { currentScreen = "quiz" }
                    )
                    "modules" -> ModuleScreen(
                        onBack = { currentScreen = "home" }
                    )
                    "practice" -> PracticeScreen(
                        onBack = { currentScreen = "home" }
                    )
                    "quiz" -> QuizScreen(
                        onBack = { currentScreen = "home" }
                    )
                    "progress" -> ProgressScreen(
                        onBack = { currentScreen = "home" }
                    )
                    "performance" -> PerformanceDashboardScreen(
                        onBack = { currentScreen = "home" }
                    )
                }
            }
        }
    }
}
