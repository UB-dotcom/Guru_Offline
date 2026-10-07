package com.guruoffline.app.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import com.guruoffline.app.profile.ProfileManager
import com.guruoffline.app.ui.screens.*
import com.guruoffline.app.ui.theme.GuruOfflineTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            GuruOfflineTheme {
                val profileManager = remember { ProfileManager() }
                var currentScreen by remember { mutableStateOf("splash") }
                var chatPrompt by remember { mutableStateOf<String?>(null) }

                val profile = profileManager.getProfile()

                when (currentScreen) {
                    // Onboarding Flow
                    "splash" -> SplashScreen(
                        onContinue = { currentScreen = "welcome" }
                    )
                    "welcome" -> WelcomeLoginScreen(
                        onLoginSuccess = { currentScreen = "language" },
                        onBack = { currentScreen = "splash" }
                    )
                    "language" -> LanguageSelectionScreen(
                        initialLanguage = profile.language,
                        onLanguageSelected = { lang ->
                            profileManager.updateLanguage(lang)
                            currentScreen = "board"
                        },
                        onBack = { currentScreen = "welcome" }
                    )
                    "board" -> BoardSelectionScreen(
                        initialBoard = profile.board,
                        onBoardSelected = { board ->
                            profileManager.updateBoard(board)
                            if (board == "STATE") {
                                currentScreen = "state"
                            } else {
                                currentScreen = "class"
                            }
                        },
                        onBack = { currentScreen = "language" }
                    )
                    "state" -> StateSelectionScreen(
                        initialState = profile.state ?: "bihar",
                        onStateSelected = { state ->
                            profileManager.updateState(state)
                            currentScreen = "class"
                        },
                        onBack = { currentScreen = "board" }
                    )
                    "class" -> ClassSelectionScreen(
                        initialClass = profile.classLevel,
                        onClassSelected = { classNum ->
                            profileManager.updateClassLevel(classNum)
                            if (classNum >= 11) {
                                currentScreen = "stream"
                            } else {
                                currentScreen = "subject"
                            }
                        },
                        onBack = {
                            if (profile.board == "STATE") currentScreen = "state"
                            else currentScreen = "board"
                        }
                    )
                    "stream" -> StreamSelectionScreen(
                        initialStream = profile.stream ?: "science",
                        onStreamSelected = { stream ->
                            profileManager.updateStream(stream)
                            currentScreen = "subject"
                        },
                        onBack = { currentScreen = "class" }
                    )
                    "subject" -> SubjectSelectionScreen(
                        board = profile.board,
                        classLevel = profile.classLevel,
                        stream = profile.stream,
                        language = profile.language,
                        initialSubjects = profile.selectedSubjects,
                        onSubjectsConfirmed = { subjects ->
                            profileManager.updateSubjects(subjects)
                            currentScreen = "module_download"
                        },
                        onBack = {
                            if (profile.classLevel >= 11) currentScreen = "stream"
                            else if (profile.board == "STATE") currentScreen = "state"
                            else currentScreen = "class"
                        },
                        onSwitchToCbse10 = {
                            profileManager.updateBoard("CBSE")
                            profileManager.updateClassLevel(10)
                            profileManager.updateState(null)
                            profileManager.updateStream(null)
                            profileManager.updateSubjects(listOf("mathematics", "science"))
                            currentScreen = "subject"
                        }
                    )
                    "module_download" -> ModuleDownloadScreen(
                        selectedSubjects = profile.selectedSubjects,
                        classLevel = profile.classLevel,
                        language = profile.language,
                        onComplete = { currentScreen = "home" },
                        onBack = { currentScreen = "subject" }
                    )

                    // Main Study Flow
                    "home" -> HomeScreen(
                        profileManager = profileManager,
                        onNavigateToChat = { prompt ->
                            chatPrompt = prompt
                            currentScreen = "chat"
                        },
                        onNavigateToModules = { currentScreen = "modules" },
                        onNavigateToPractice = { currentScreen = "practice" },
                        onNavigateToQuiz = { currentScreen = "quiz" },
                        onNavigateToProgress = { currentScreen = "progress" },
                        onNavigateToPerformance = { currentScreen = "performance" },
                        onChangeCurriculum = { currentScreen = "language" }
                    )
                    "chat" -> ChatScreen(
                        profileManager = profileManager,
                        initialPrompt = chatPrompt,
                        onBack = {
                            chatPrompt = null
                            currentScreen = "home"
                        },
                        onNavigateToPractice = { currentScreen = "practice" },
                        onNavigateToQuiz = { currentScreen = "quiz" }
                    )
                    "modules" -> ModuleScreen(
                        profileManager = profileManager,
                        onBack = { currentScreen = "home" }
                    )
                    "practice" -> PracticeScreen(
                        profileManager = profileManager,
                        onBack = { currentScreen = "home" }
                    )
                    "quiz" -> QuizScreen(
                        profileManager = profileManager,
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
