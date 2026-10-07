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
import com.guruoffline.app.profile.ProfileManager
import com.guruoffline.app.ui.theme.PrimaryBlue

@Composable
fun ModuleScreen(
    profileManager: ProfileManager = remember { ProfileManager() },
    onBack: () -> Unit
) {
    val profile = profileManager.getProfile()
    val modules = remember(profile.selectedSubjects, profile.classLevel) {
        val list = mutableListOf<CurriculumModule>()
        // All user selected subjects are installed
        profile.selectedSubjects.forEach { sub ->
            val displayName = sub.replace("_", " ").replaceFirstChar { it.uppercase() }
            val topics = when (sub.lowercase()) {
                "mathematics" -> listOf("Algebra", "Trigonometry", "Quadratics", "Arithmetic Progressions")
                "science" -> listOf("Chemical Reactions", "Acids & Bases", "Electricity", "Newton's Laws")
                "physics" -> listOf("Electrostatics", "Current Electricity", "Magnetism", "Optics")
                "chemistry" -> listOf("Solutions", "Electrochemistry", "Chemical Kinetics", "Coordination")
                "biology" -> listOf("Reproduction", "Genetics & Evolution", "Biotechnology", "Ecology")
                "english" -> listOf("First Flight", "Footprints Without Feet", "Grammar & Composition")
                "social_science", "history" -> listOf("Nationalism in Europe", "Nationalism in India", "Resources & Development")
                else -> listOf("Chapter 1: Foundations", "Chapter 2: Core Concepts", "Chapter 3: Advanced Topics")
            }
            list.add(
                CurriculumModule(
                    id = "class${profile.classLevel}_$sub",
                    name = "Class ${profile.classLevel} $displayName",
                    classLevel = "${profile.classLevel}",
                    subject = displayName,
                    sizeMb = when (sub) { "science" -> 81; "mathematics" -> 72; "physics" -> 68; "chemistry" -> 64; else -> 45 },
                    topics = topics,
                    isInstalled = true
                )
            )
        }
        mutableStateListOf<CurriculumModule>().apply { addAll(list) }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
    ) {
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
                text = "Class ${profile.classLevel} ${profile.board} • Download packages for offline study",
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
