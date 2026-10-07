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
import com.guruoffline.app.ui.components.OfflineBanner
import com.guruoffline.app.ui.theme.EmeraldGreen
import com.guruoffline.app.ui.theme.PrimaryBlue

@Composable
fun PracticeScreen(onBack: () -> Unit) {
    var selectedOption by remember { mutableStateOf<String?>(null) }
    var isSubmitted by remember { mutableStateOf(false) }

    val question = "A car travels at 20 m/s for 5 seconds. What distance does it travel?"
    val options = listOf("A) 50 m", "B) 100 m", "C) 150 m", "D) 200 m")
    val correct = "B) 100 m"
    val explanation = "Distance = Speed × Time = 20 m/s × 5 s = 100 meters."

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
    ) {
        OfflineBanner(isOffline = true)

        Column(modifier = Modifier.padding(20.dp)) {
            Text(
                text = "Practice Mode",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF0F172A)
            )
            Text(
                text = "Topic: Speed, Distance & Time (Class 5/10 Physics)",
                fontSize = 13.sp,
                color = Color(0xFF64748B),
                modifier = Modifier.padding(bottom = 20.dp)
            )

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

                    options.forEach { opt ->
                        val isSelected = selectedOption == opt
                        val bgColor = when {
                            isSubmitted && opt == correct -> Color(0xFFD1FAE5)
                            isSubmitted && isSelected && opt != correct -> Color(0xFFFEE2E2)
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
                                containerColor = if (selectedOption == correct) Color(0xFFECFDF5) else Color(0xFFFEF2F2)
                            ),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Text(
                                    text = if (selectedOption == correct) "✓ Correct Answer!" else "✗ Not quite right",
                                    fontWeight = FontWeight.Bold,
                                    color = if (selectedOption == correct) EmeraldGreen else Color(0xFFDC2626)
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
