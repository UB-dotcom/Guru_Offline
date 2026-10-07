package com.guruoffline.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.guruoffline.app.model.CurriculumModule
import com.guruoffline.app.ui.components.OfflineBanner
import com.guruoffline.app.ui.theme.EmeraldGreen
import com.guruoffline.app.ui.theme.PrimaryBlue

@Composable
fun ModuleScreen(onBack: () -> Unit) {
    val modules = remember {
        mutableStateListOf(
            CurriculumModule(
                id = "class10_math",
                name = "Class 10 Mathematics",
                classLevel = "10",
                subject = "Mathematics",
                sizeMb = 72,
                topics = listOf("Algebra", "Trigonometry", "Quadratics", "Arithmetic Progressions"),
                isInstalled = true
            ),
            CurriculumModule(
                id = "class10_science",
                name = "Class 10 Science",
                classLevel = "10",
                subject = "Science",
                sizeMb = 81,
                topics = listOf("Chemical Reactions", "Acids & Bases", "Electricity", "Newton's Laws"),
                isInstalled = true
            ),
            CurriculumModule(
                id = "class5_math",
                name = "Class 5 Mathematics",
                classLevel = "5",
                subject = "Mathematics",
                sizeMb = 45,
                topics = listOf("Large Numbers", "Fractions", "Perimeter & Area", "Speed & Time"),
                isInstalled = false
            ),
            CurriculumModule(
                id = "bca_cs",
                name = "BCA / Computer Science",
                classLevel = "College",
                subject = "Computer Science",
                sizeMb = 65,
                topics = listOf("Python Basics", "OOP", "Stacks & Queues", "Algorithms"),
                isInstalled = false
            )
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
    ) {
        OfflineBanner(isOffline = false)

        Column(modifier = Modifier.padding(20.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
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
                text = "Curriculum Modules",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF0F172A)
            )
            Text(
                text = "Download while online to study anytime without internet",
                fontSize = 13.sp,
                color = Color(0xFF64748B),
                modifier = Modifier.padding(bottom = 16.dp)
            )

            LazyColumn(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                items(modules) { mod ->
                    ModuleItemCard(
                        module = mod,
                        onDownload = {
                            mod.isInstalled = true
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun ModuleItemCard(
    module: CurriculumModule,
    onDownload: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = module.name,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF0F172A)
                    )
                    Text(
                        text = "Size: ${module.sizeMb} MB • v${module.version}",
                        fontSize = 12.sp,
                        color = Color(0xFF64748B)
                    )
                }

                if (module.isInstalled) {
                    Surface(
                        color = Color(0xFFD1FAE5),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            text = "✓ Installed",
                            color = EmeraldGreen,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                        )
                    }
                } else {
                    Button(
                        onClick = onDownload,
                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Text(text = "Download", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = "Topics: " + module.topics.joinToString(", "),
                fontSize = 11.sp,
                color = Color(0xFF475569)
            )

            if (module.isInstalled) {
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "✓ Available Offline (RAG Index Ready)",
                    fontSize = 11.sp,
                    color = EmeraldGreen,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}
