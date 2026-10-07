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
import com.guruoffline.app.model.Message
import com.guruoffline.app.model.MessageSender
import com.guruoffline.app.ui.components.ActionPillsRow
import com.guruoffline.app.ui.components.OfflineBanner
import com.guruoffline.app.ui.theme.EmeraldGreen
import com.guruoffline.app.ui.theme.PrimaryBlue

@Composable
fun ChatScreen(
    onBack: () -> Unit,
    onNavigateToPractice: () -> Unit,
    onNavigateToQuiz: () -> Unit
) {
    var inputText by remember { mutableStateOf("") }
    val messages = remember {
        mutableStateListOf(
            Message(
                sender = MessageSender.GURU_OFFLINE,
                text = "Namaste! I am Guru, your offline tutor. Ask me any question from your curriculum, and I will explain it step by step!"
            )
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
    ) {
        OfflineBanner(isOffline = true)

        // Top App Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White)
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "←",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF0F172A),
                modifier = Modifier
                    .clickable { onBack() }
                    .padding(end = 12.dp)
            )
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Guru Tutor (Offline)",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF0F172A)
                )
                Text(
                    text = "Class 10 Science • Local SLM Active",
                    fontSize = 11.sp,
                    color = EmeraldGreen,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }

        // Messages List
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 16.dp),
            contentPadding = PaddingValues(vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(messages) { msg ->
                ChatBubble(msg = msg)
            }
        }

        // Follow-up suggestions row
        ActionPillsRow(
            onActionClick = { action ->
                when (action) {
                    "Practice" -> onNavigateToPractice()
                    "Quiz" -> onNavigateToQuiz()
                    "Explain More Simply" -> {
                        messages.add(Message(sender = MessageSender.STUDENT, text = "Can you explain that more simply?"))
                        messages.add(
                            Message(
                                sender = MessageSender.GURU_OFFLINE,
                                text = "Here is a simpler picture: Imagine pushing an empty shopping cart vs a cart filled with heavy groceries. The heavy one needs much more push to move! More mass = More force needed! (F = m × a)"
                            )
                        )
                    }
                    "Give Another Example" -> {
                        messages.add(Message(sender = MessageSender.STUDENT, text = "Give another example."))
                        messages.add(
                            Message(
                                sender = MessageSender.GURU_OFFLINE,
                                text = "Example: A 1,000 kg car accelerates at 3 m/s².\nFormula: F = m × a\nCalculation: F = 1000 × 3 = 3,000 N.\nFinal Answer: 3,000 Newtons."
                            )
                        )
                    }
                    else -> {
                        messages.add(Message(sender = MessageSender.STUDENT, text = action))
                    }
                }
            }
        )

        // Input Field
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White)
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = inputText,
                onValueChange = { inputText = it },
                placeholder = { Text("Ask a curriculum question...", fontSize = 13.sp) },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(24.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrimaryBlue,
                    unfocusedBorderColor = Color(0xFFCBD5E1)
                ),
                maxLines = 3
            )
            Spacer(modifier = Modifier.width(8.dp))
            Button(
                onClick = {
                    if (inputText.isNotBlank()) {
                        val q = inputText.trim()
                        messages.add(Message(sender = MessageSender.STUDENT, text = q))
                        inputText = ""

                        // Local answer logic
                        if (q.contains("Newton", ignoreCase = true) || q.contains("second law", ignoreCase = true)) {
                            messages.add(
                                Message(
                                    sender = MessageSender.GURU_OFFLINE,
                                    text = "Let's solve it step by step.\n\n" +
                                            "Step 1: Statement\n" +
                                            "The rate of change of momentum of an object is proportional to the applied force.\n\n" +
                                            "Step 2: Formula Derivation\n" +
                                            "Force = Mass × Acceleration\n" +
                                            "F = m × a (measured in Newtons, N)\n\n" +
                                            "Step 3: Real Example\n" +
                                            "A cricket fielder pulls hands backward to cushion a fast ball, reducing impact force.\n\n" +
                                            "Final Takeaway: F = m × a.",
                                    latencyMs = 380,
                                    ramUsageMb = 145.2f
                                )
                            )
                        } else if (q.contains("2x + 5 = 15") || (q.contains("2x") && q.contains("15"))) {
                            messages.add(
                                Message(
                                    sender = MessageSender.GURU_OFFLINE,
                                    text = "Let's solve it step by step.\n\n" +
                                            "Step 1: Subtract 5 from both sides.\n" +
                                            "2x + 5 - 5 = 15 - 5\n" +
                                            "2x = 10\n\n" +
                                            "Step 2: Divide both sides by 2.\n" +
                                            "x = 5\n\n" +
                                            "Final answer: x = 5",
                                    latencyMs = 290,
                                    ramUsageMb = 142.0f
                                )
                            )
                        } else {
                            messages.add(
                                Message(
                                    sender = MessageSender.GURU_OFFLINE,
                                    text = "Let's break down this concept step by step based on your Class 10 Science curriculum.\n\n" +
                                            "Step 1: Identify given quantities and foundational definitions.\n\n" +
                                            "Step 2: Apply the curriculum formula.\n\n" +
                                            "Step 3: Check units and verify final result.",
                                    latencyMs = 410,
                                    ramUsageMb = 148.0f
                                )
                            )
                        }
                    }
                },
                shape = RoundedCornerShape(24.dp),
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue)
            ) {
                Text("Ask", fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun ChatBubble(msg: Message) {
    val isUser = msg.sender == MessageSender.STUDENT
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = if (isUser) Alignment.End else Alignment.Start
    ) {
        Card(
            shape = RoundedCornerShape(
                topStart = 16.dp,
                topEnd = 16.dp,
                bottomStart = if (isUser) 16.dp else 2.dp,
                bottomEnd = if (isUser) 2.dp else 16.dp
            ),
            colors = CardDefaults.cardColors(
                containerColor = if (isUser) PrimaryBlue else Color.White
            ),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
            modifier = Modifier.widthIn(max = 320.dp)
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                if (!isUser) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(bottom = 6.dp)
                    ) {
                        Text(
                            text = "Guru (Offline AI)",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = PrimaryBlue
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "• On-device",
                            fontSize = 10.sp,
                            color = EmeraldGreen,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                Text(
                    text = msg.text,
                    fontSize = 14.sp,
                    color = if (isUser) Color.White else Color(0xFF1E293B),
                    lineHeight = 20.sp
                )

                if (!isUser && msg.latencyMs > 0) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "⚡ Latency: ${msg.latencyMs}ms | RAM: ${msg.ramUsageMb}MB",
                        fontSize = 10.sp,
                        color = Color(0xFF94A3B8)
                    )
                }
            }
        }
    }
}
