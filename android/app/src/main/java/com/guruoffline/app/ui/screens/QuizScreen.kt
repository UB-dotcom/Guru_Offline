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
import com.guruoffline.app.model.QuizQuestion
import com.guruoffline.app.quiz.QuizEngine
import com.guruoffline.app.ui.components.OfflineBanner
import com.guruoffline.app.ui.theme.EmeraldGreen
import com.guruoffline.app.ui.theme.PrimaryBlue

@Composable
fun QuizScreen(onBack: () -> Unit) {
    val quizEngine = remember { QuizEngine() }
    val questions = remember { quizEngine.getSampleQuiz("class10_science") }

    var currentIdx by remember { mutableStateOf(0) }
    val userAnswers = remember { mutableStateMapOf<Int, String>() }
    var isFinished by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
    ) {
        OfflineBanner(isOffline = true)

        Column(modifier = Modifier.padding(20.dp)) {
            Text(
                text = "Curriculum Quiz",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF0F172A)
            )

            if (!isFinished) {
                val q = questions[currentIdx]
                Text(
                    text = "Question ${currentIdx + 1} of ${questions.size} • Topic: ${q.topic}",
                    fontSize = 13.sp,
                    color = Color(0xFF64748B),
                    modifier = Modifier.padding(bottom = 16.dp)
                )

                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Text(
                            text = q.question,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF0F172A),
                            lineHeight = 22.sp
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        q.options.forEach { opt ->
                            val optKey = opt.take(1)
                            val isSelected = userAnswers[q.qId] == optKey

                            Card(
                                shape = RoundedCornerShape(10.dp),
                                colors = CardDefaults.cardColors(
                                    containerColor = if (isSelected) Color(0xFFEFF6FF) else Color(0xFFF8FAFC)
                                ),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp)
                                    .clickable { userAnswers[q.qId] = optKey }
                            ) {
                                Text(
                                    text = opt,
                                    fontSize = 14.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                    color = if (isSelected) PrimaryBlue else Color(0xFF1E293B),
                                    modifier = Modifier.padding(14.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(20.dp))

                        Button(
                            onClick = {
                                if (currentIdx < questions.size - 1) {
                                    currentIdx++
                                } else {
                                    isFinished = true
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue),
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp),
                            enabled = userAnswers.containsKey(q.qId)
                        ) {
                            Text(
                                text = if (currentIdx < questions.size - 1) "Next Question ➔" else "Submit Quiz",
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            } else {
                // Quiz Evaluation Results
                val result = quizEngine.evaluateQuiz(questions, userAnswers)
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Text(
                            text = "Quiz Result",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF0F172A)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Score: ${result.correctAnswers} / ${result.totalQuestions}",
                            fontSize = 28.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = PrimaryBlue
                        )

                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "Strong Topics:",
                            fontWeight = FontWeight.Bold,
                            color = EmeraldGreen,
                            fontSize = 14.sp
                        )
                        result.strongTopics.forEach {
                            Text("✓ $it", fontSize = 13.sp, color = Color(0xFF334155))
                        }

                        if (result.weakTopics.isNotEmpty()) {
                            Spacer(modifier = Modifier.height(12.dp))
                            Text(
                                text = "Needs Practice:",
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFFDC2626),
                                fontSize = 14.sp
                            )
                            result.weakTopics.forEach {
                                Text("⚠ $it", fontSize = 13.sp, color = Color(0xFF334155))
                            }
                        }

                        Spacer(modifier = Modifier.height(20.dp))
                        Button(
                            onClick = {
                                currentIdx = 0
                                userAnswers.clear()
                                isFinished = false
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue),
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text("Retake Quiz", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}
