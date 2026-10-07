package com.guruoffline.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.guruoffline.app.quiz.QuizEngine
import com.guruoffline.app.ui.components.OfflineBanner
import com.guruoffline.app.ui.theme.EmeraldGreen
import com.guruoffline.app.ui.theme.PrimaryBlue

import com.guruoffline.app.profile.ProfileManager

@Composable
fun PracticeScreen(
    profileManager: ProfileManager = remember { ProfileManager() },
    onBack: () -> Unit
) {
    val profile = profileManager.getProfile()
    val isMath = profile.selectedSubjects.contains("mathematics")
    val moduleId = if (isMath) "class10_math" else "class10_science"

    val quizEngine = remember { QuizEngine() }
    var difficulty by remember { mutableStateOf("easy") }
    var selectedOption by remember { mutableStateOf<String?>(null) }
    var isSubmitted by remember { mutableStateOf(false) }

    val practiceQ = remember(difficulty, moduleId) { quizEngine.getSamplePractice(moduleId, difficulty) }
    val question = practiceQ.question
    val options = practiceQ.options
    val correct = practiceQ.correctOption
    val explanation = practiceQ.explanation

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Row(
                modifier = Modifier
                    .padding(bottom = 12.dp)
                    .clickable { onBack() }
            ) {
                Text(
                    text = "← Back",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = PrimaryBlue
                )
            }

            Text(
                text = "Practice Mode",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF0F172A)
            )
            Text(
                text = "Topic: ${practiceQ.topic} (CBSE Class 10 Math)",
                fontSize = 13.sp,
                color = Color(0xFF64748B),
                modifier = Modifier.padding(bottom = 12.dp)
            )

            // Difficulty selector pills
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Button(
                    onClick = {
                        difficulty = "easy"
                        selectedOption = null
                        isSubmitted = false
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (difficulty == "easy") PrimaryBlue else Color(0xFFE2E8F0),
                        contentColor = if (difficulty == "easy") Color.White else Color(0xFF334155)
                    ),
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    Text("🌱 Easy Question", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }

                Button(
                    onClick = {
                        difficulty = "hard"
                        selectedOption = null
                        isSubmitted = false
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (difficulty == "hard") Color(0xFFEA580C) else Color(0xFFE2E8F0),
                        contentColor = if (difficulty == "hard") Color.White else Color(0xFF334155)
                    ),
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    Text("🔥 Harder Question", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }

            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text(
                        text = question,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF0F172A),
                        lineHeight = 22.sp
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    val isChoiceCorrect = selectedOption?.let { it.startsWith(correct) || it == correct } == true

                    options.forEach { opt ->
                        val isSelected = selectedOption == opt
                        val isOptCorrect = opt.startsWith(correct) || opt == correct
                        val bgColor = when {
                            isSubmitted && isOptCorrect -> Color(0xFFD1FAE5)
                            isSubmitted && isSelected && !isOptCorrect -> Color(0xFFFEE2E2)
                            isSelected -> Color(0xFFEFF6FF)
                            else -> Color(0xFFF8FAFC)
                        }

                        Card(
                            shape = RoundedCornerShape(10.dp),
                            colors = CardDefaults.cardColors(containerColor = bgColor),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 5.dp)
                                .clickable(enabled = !isSubmitted) { selectedOption = opt }
                        ) {
                            Text(
                                text = opt,
                                fontSize = 14.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                color = Color(0xFF1E293B),
                                modifier = Modifier.padding(14.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    if (!isSubmitted) {
                        Button(
                            onClick = { if (selectedOption != null) isSubmitted = true },
                            colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue),
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp),
                            enabled = selectedOption != null
                        ) {
                            Text("Submit Answer", fontWeight = FontWeight.Bold)
                        }
                    } else {
                        // Explanation
                        Card(
                            shape = RoundedCornerShape(10.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = if (isChoiceCorrect) Color(0xFFECFDF5) else Color(0xFFFEF2F2)
                            ),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Text(
                                    text = if (isChoiceCorrect) "✓ Correct Answer!" else "✗ Not quite right",
                                    fontWeight = FontWeight.Bold,
                                    color = if (isChoiceCorrect) EmeraldGreen else Color(0xFFDC2626)
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "Guru's Explanation:\n$explanation",
                                    fontSize = 12.sp,
                                    color = Color(0xFF334155)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
