package com.guruoffline.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.guruoffline.app.progress.ProgressTracker
import com.guruoffline.app.ui.components.OfflineBanner
import com.guruoffline.app.ui.theme.EmeraldGreen
import com.guruoffline.app.ui.theme.PrimaryBlue

@Composable
fun ProgressScreen(onBack: () -> Unit) {
    val progressTracker = remember { ProgressTracker() }
    val progressList = remember { progressTracker.getAllProgress() }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
    ) {
        OfflineBanner(isOffline = true)

        Column(
            modifier = Modifier
                .padding(20.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Text(
                text = "My Learning Progress",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF0F172A)
            )
            Text(
                text = "Saved 100% locally on this device",
                fontSize = 13.sp,
                color = Color(0xFF64748B),
                modifier = Modifier.padding(bottom = 20.dp)
            )

            progressList.forEach { sub ->
                Card(
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 14.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = sub.subjectName,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF0F172A)
                            )
                            Text(
                                text = "${sub.completedPercentage}%",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = PrimaryBlue
                            )
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        LinearProgressIndicator(
                            progress = sub.completedPercentage / 100f,
                            color = PrimaryBlue,
                            trackColor = Color(0xFFE2E8F0),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(8.dp)
                        )

                        Spacer(modifier = Modifier.height(10.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "Questions Attempted: ${sub.questionsAttempted}",
                                fontSize = 12.sp,
                                color = Color(0xFF64748B)
                            )
                            Text(
                                text = "Quiz Avg: ${sub.quizAverage}%",
                                fontSize = 12.sp,
                                color = EmeraldGreen,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }
            }
        }
    }
}
