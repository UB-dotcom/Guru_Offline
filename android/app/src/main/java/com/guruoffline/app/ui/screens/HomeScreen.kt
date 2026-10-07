package com.guruoffline.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.guruoffline.app.ui.components.OfflineBanner
import com.guruoffline.app.ui.theme.EmeraldGreen
import com.guruoffline.app.ui.theme.PrimaryBlue

@Composable
fun HomeScreen(
    onNavigateToChat: () -> Unit,
    onNavigateToModules: () -> Unit,
    onNavigateToPractice: () -> Unit,
    onNavigateToQuiz: () -> Unit,
    onNavigateToProgress: () -> Unit,
    onNavigateToPerformance: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
    ) {
        OfflineBanner(isOffline = true)

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp)
                .verticalScroll(rememberScrollState())
        ) {
            // Header
            Text(
                text = "Guru Offline",
                fontSize = 28.sp,
                fontWeight = FontWeight.ExtraBold,
                color = Color(0xFF0F172A)
            )
            Text(
                text = "Your on-device, zero-internet AI tutor",
                fontSize = 14.sp,
                color = Color(0xFF64748B),
                modifier = Modifier.padding(bottom = 20.dp)
            )

            // Active Subject Card
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = PrimaryBlue),
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onNavigateToChat() }
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = "CONTINUE LEARNING",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF93C5FD)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Class 10 Science",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        text = "Force, Newton's Laws & Electricity",
                        fontSize = 13.sp,
                        color = Color(0xFFE2E8F0)
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = { onNavigateToChat() },
                        colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            text = "Ask Guru Now ➔",
                            color = PrimaryBlue,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
            Text(
                text = "Study Modes",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1E293B)
            )
            Spacer(modifier = Modifier.height(12.dp))

            // Action Grid
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                HomeActionCard(
                    title = "Ask Guru",
                    subtitle = "Step-by-step AI answers",
                    icon = "💬",
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToChat
                )
                HomeActionCard(
                    title = "My Subjects",
                    subtitle = "Download & manage modules",
                    icon = "📚",
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToModules
                )
            }
            Spacer(modifier = Modifier.height(12.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                HomeActionCard(
                    title = "Practice",
                    subtitle = "Curriculum exercises",
                    icon = "✏️",
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToPractice
                )
                HomeActionCard(
                    title = "Quiz Mode",
                    subtitle = "5-Question tests",
                    icon = "🎯",
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToQuiz
                )
            }
            Spacer(modifier = Modifier.height(12.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                HomeActionCard(
                    title = "Progress",
                    subtitle = "Scores & learning stats",
                    icon = "📊",
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToProgress
                )
                HomeActionCard(
                    title = "Performance",
                    subtitle = "RAM & Latency stats",
                    icon = "⚡",
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToPerformance
                )
            }
        }
    }
}

@Composable
fun HomeActionCard(
    title: String,
    subtitle: String,
    icon: String,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = modifier.clickable { onClick() }
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Text(text = icon, fontSize = 24.sp)
            Spacer(modifier = Modifier.height(6.dp))
            Text(text = title, fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color(0xFF0F172A))
            Text(text = subtitle, fontSize = 11.sp, color = Color(0xFF64748B))
        }
    }
}
