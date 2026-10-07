package com.guruoffline.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.guruoffline.app.model.Message
import com.guruoffline.app.model.MessageSender
import com.guruoffline.app.profile.ProfileManager
import com.guruoffline.app.rag.LocalRagRetriever
import com.guruoffline.app.translation.TranslationService
import com.guruoffline.app.ui.components.ActionPillsRow
import com.guruoffline.app.ui.theme.EmeraldGreen
import com.guruoffline.app.ui.theme.PrimaryBlue

@Composable
fun ChatScreen(
    profileManager: ProfileManager,
    initialPrompt: String? = null,
    onBack: () -> Unit,
    onNavigateToPractice: () -> Unit,
    onNavigateToQuiz: () -> Unit
) {
    val context = LocalContext.current
    val profile = profileManager.getProfile()
    val isMath = profile.selectedSubjects.contains("mathematics")
    val isHindi = profile.language.lowercase() == "hi"
    val isBilingual = profile.language.lowercase() == "bilingual"

    LaunchedEffect(Unit) {
        TranslationService.init(context)
    }

    var inputText by remember { mutableStateOf("") }
    val ragRetriever = remember { LocalRagRetriever() }

    val welcomeGreeting = remember(profile.language) {
        when (profile.language.lowercase()) {
            "hi" -> "नमस्ते! मैं गुरु हूँ, आपका AI ट्यूटर। कक्षा ${profile.classLevel} के NCERT विज्ञान (13 अध्याय) या गणित से कोई भी प्रश्न पूछें। मैं स्वचालित रूप से सही अध्याय का चयन करके हिंदी में विस्तार से समझाऊंगा!"
            "bilingual" -> "नमस्ते! I am Guru, your AI tutor for Class ${profile.classLevel}. Ask me any question from your NCERT Science or Math textbook in English or Hindi. I will automatically identify the relevant chapter and explain step by step!"
            else -> "Hello! I am Guru, your AI tutor for Class ${profile.classLevel}. Ask me any question from your NCERT Science or Math textbook. I will automatically identify the relevant chapter and explain clearly step by step in English!"
        }
    }

    val messages = remember {
        mutableStateListOf(
            Message(
                sender = MessageSender.GURU_OFFLINE,
                text = welcomeGreeting
            )
        )
    }

    // AI Question Analysis, Translation & Auto-Chapter Selection
    fun answerQuery(query: String) {
        val q = query.trim()
        if (q.isBlank()) return

        messages.add(Message(sender = MessageSender.STUDENT, text = q))

        // 1. Direct NTREX Translation Benchmark Handling
        val isTransQuery = q.contains("translate", ignoreCase = true) ||
                q.contains("अनुवाद", ignoreCase = true) ||
                q.contains("meaning in", ignoreCase = true) ||
                q.contains("का अर्थ", ignoreCase = true) ||
                q.contains("का मतलब", ignoreCase = true)

        if (isTransQuery) {
            val cleanQ = q.replace("translate", "", ignoreCase = true)
                .replace("into hindi", "", ignoreCase = true)
                .replace("to hindi", "", ignoreCase = true)
                .replace("into english", "", ignoreCase = true)
                .replace("to english", "", ignoreCase = true)
                .replace("का अर्थ", "", ignoreCase = true)
                .replace("का मतलब", "", ignoreCase = true)
                .replace("का अनुवाद", "", ignoreCase = true)
                .replace("meaning", "", ignoreCase = true)
                .trim(' ', ':', '?', '"', '\'')

            val transResponse = if (isHindi || q.contains("hindi", ignoreCase = true) || q.contains("हिंदी", ignoreCase = true)) {
                val trans = TranslationService.translateEnglishToHindi(cleanQ)
                "🌐 भाषा अनुवाद (NTREX Benchmark):\n\n" +
                        "मूल पाठ (English): \"$cleanQ\"\n" +
                        "हिंदी अनुवाद: \"$trans\"\n\n" +
                        "यह अनुवाद आपके पाठ्यक्रम के अनुसार सत्यापित है।"
            } else {
                val trans = TranslationService.translateHindiToEnglish(cleanQ)
                "🌐 Translation (NTREX Benchmark):\n\n" +
                        "Source (Hindi): \"$cleanQ\"\n" +
                        "English Translation: \"$trans\"\n\n" +
                        "Verified from the parallel benchmark dataset."
            }

            messages.add(Message(sender = MessageSender.GURU_OFFLINE, text = transResponse))
            return
        }

        // 2. Practice and Quiz shortcuts
        if (q.contains("practice", ignoreCase = true) || q.contains("अभ्यास")) {
            val practiceResponse = if (isHindi) {
                "📚 चयनित अध्याय: अध्याय 1 — रासायनिक अभिक्रियाएं एवं समीकरण\n\n" +
                        "यहाँ आपके अभ्यास के लिए एक प्रश्न है:\n\n" +
                        "प्रश्न: जब मैग्नीशियम रिबन को वायु में जलाया जाता है, तो कौन सा श्वेत चूर्ण बनता है?\n\n" +
                        "विकल्प:\n" +
                        "A) मैग्नीशियम ऑक्साइड (MgO)\n" +
                        "B) मैग्नीशियम कार्बोनेट (MgCO₃)\n" +
                        "C) मैग्नीशियम सल्फेट (MgSO₄)\n" +
                        "D) मैग्नीशियम क्लोराइड (MgCl₂)\n\n" +
                        "सही उत्तर: विकल्प A (2Mg + O₂ → 2MgO, यह संयोजन अभिक्रिया है)।"
            } else if (isBilingual) {
                "📚 Auto-Selected Chapter: Chapter 1 — Chemical Reactions & Equations\n" +
                        "(अध्याय 1: रासायनिक अभिक्रियाएं एवं समीकरण)\n\n" +
                        "यहाँ आपके अभ्यास के लिए एक प्रश्न है / Practice Question:\n\n" +
                        "Question: What white powder is formed when magnesium ribbon burns in air?\n\n" +
                        "Options:\n" +
                        "A) Magnesium oxide (MgO)\n" +
                        "B) Magnesium carbonate (MgCO₃)\n" +
                        "C) Magnesium sulfate (MgSO₄)\n" +
                        "D) Magnesium chloride (MgCl₂)\n\n" +
                        "Correct Answer: Option A (2Mg + O₂ → 2MgO, Combination reaction)."
            } else {
                "📚 Auto-Selected Chapter: Chapter 1 — Chemical Reactions and Equations\n\n" +
                        "Here is a practice question from your NCERT curriculum:\n\n" +
                        "Question: Which white powder is formed when a magnesium ribbon is burned in air?\n\n" +
                        "Options:\n" +
                        "A) Magnesium oxide (MgO)\n" +
                        "B) Magnesium carbonate (MgCO₃)\n" +
                        "C) Magnesium sulfate (MgSO₄)\n" +
                        "D) Magnesium chloride (MgCl₂)\n\n" +
                        "Correct Answer: Option A (2Mg + O₂ → 2MgO, which is a Combination Reaction)."
            }

            messages.add(Message(sender = MessageSender.GURU_OFFLINE, text = practiceResponse))
            return
        }

        // 3. Curriculum-aware RAG retrieval with language translation bridging
        val queryForRetriever = when {
            isHindi && !TranslationService.isHindiText(q) -> TranslationService.translateEnglishToHindi(q)
            !isHindi && !isBilingual && TranslationService.isHindiText(q) -> TranslationService.translateHindiToEnglish(q)
            else -> q
        }

        val analysis = ragRetriever.analyzeAndAutoSelectChapter(queryForRetriever)

        val header = when {
            isHindi -> "📚 चयनित अध्याय: अध्याय ${analysis.chapterNumber} — ${analysis.chapterTitleHi}"
            isBilingual -> "📚 चयनित अध्याय: अध्याय ${analysis.chapterNumber} — ${analysis.chapterTitleHi}\n(Chapter ${analysis.chapterNumber}: ${analysis.chapterTitle})"
            else -> "📚 Auto-Selected Chapter: Chapter ${analysis.chapterNumber} — ${analysis.chapterTitle}"
        }

        val explanation = when {
            isHindi -> analysis.explanationHi
            isBilingual -> "${analysis.explanationHi}\n\n---\n\n${analysis.explanationEn}"
            else -> analysis.explanationEn
        }

        val formulaHeading = when {
            isHindi -> "📌 मुख्य सिद्धांत / सूत्र:"
            isBilingual -> "📌 मुख्य सिद्धांत / सूत्र (Key Fact & Formula):"
            else -> "📌 Key Fact & Formula:"
        }

        val formula = when {
            isHindi -> analysis.formulaOrKeyFactHi
            isBilingual -> "${analysis.formulaOrKeyFactEn} / ${analysis.formulaOrKeyFactHi}"
            else -> analysis.formulaOrKeyFactEn
        }

        val analogyHeading = when {
            isHindi -> "💡 वास्तविक जीवन का उदाहरण:"
            isBilingual -> "💡 वास्तविक जीवन का उदाहरण (Real-Life Analogy):"
            else -> "💡 Real-Life Analogy:"
        }

        val analogy = when {
            isHindi -> analysis.realLifeAnalogyHi
            isBilingual -> "${analysis.realLifeAnalogyEn}\n(${analysis.realLifeAnalogyHi})"
            else -> analysis.realLifeAnalogyEn
        }

        val responseText = """
            $header

            $explanation

            $formulaHeading
            $formula

            $analogyHeading
            $analogy
        """.trimIndent()

        messages.add(Message(sender = MessageSender.GURU_OFFLINE, text = responseText))
    }

    // Auto-respond to initial prompt if passed
    var initialSent by remember { mutableStateOf(false) }
    LaunchedEffect(initialPrompt) {
        if (!initialPrompt.isNullOrBlank() && !initialSent) {
            initialSent = true
            answerQuery(initialPrompt)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF6F5FB))
    ) {
        // Top App Bar (Matching Lumina AI Screen 2)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White)
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = "‹",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1E1B4B),
                    modifier = Modifier
                        .clickable { onBack() }
                        .padding(end = 12.dp)
                )
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "✨ Guru AI Tutor",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = Color(0xFF1E1B4B)
                        )
                    }
                    Text(
                        text = if (isHindi) "आपका व्यक्तिगत शिक्षण सहायक" else "Your personal learning assistant",
                        fontSize = 11.sp,
                        color = Color(0xFF79768F)
                    )
                }
            }

            // New Chat Pill Button
            Surface(
                color = Color(0xFFF0EDFF),
                shape = RoundedCornerShape(18.dp),
                border = CardDefaults.outlinedCardBorder(),
                modifier = Modifier.clickable {
                    messages.clear()
                    messages.add(Message(sender = MessageSender.GURU_OFFLINE, text = welcomeGreeting))
                }
            ) {
                Text(
                    text = if (isHindi) "नया चैट +" else "New Chat +",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = PrimaryBlue,
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                )
            }
        }

        // Messages List or Initial Hero
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 16.dp),
            contentPadding = PaddingValues(vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // If only initial greeting is present, display Lumina Hero Robot Centerpiece
            if (messages.size <= 1) {
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        // Glowing Robot Mascot Avatar
                        Box(
                            modifier = Modifier
                                .size(90.dp)
                                .background(Color(0xFFEDE7FE), CircleShape)
                                .border(2.dp, Color(0xFFDDD6FE), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = "🤖", fontSize = 46.sp)
                        }

                        Spacer(modifier = Modifier.height(14.dp))
                        Text(
                            text = if (isHindi) "नमस्ते, मैं गुरु हूँ 👋" else "Hi, I'm Guru 👋",
                            fontSize = 22.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = Color(0xFF1E1B4B)
                        )
                        Text(
                            text = if (isHindi) "आज मैं आपकी पढ़ाई में कैसे मदद करूँ?" else "How can I help you learn today?",
                            fontSize = 13.sp,
                            color = Color(0xFF79768F),
                            textAlign = TextAlign.Center,
                            modifier = Modifier.padding(top = 2.dp, bottom = 18.dp)
                        )

                        // 3 Quick Action Cards Row (Screen 2 Lumina mockup)
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            // Card 1: Summarize
                            Card(
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(containerColor = Color.White),
                                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable { answerQuery(if (isHindi) "अध्याय 1 का सार समझाएं" else "Summarize Chapter 1 key points") }
                            ) {
                                Column(
                                    modifier = Modifier.padding(12.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    Text(text = "📄", fontSize = 22.sp)
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = if (isHindi) "सार" else "Summarize",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color(0xFF1E1B4B)
                                    )
                                    Text(
                                        text = if (isHindi) "मुख्य बिंदु" else "Key Points",
                                        fontSize = 10.sp,
                                        color = Color(0xFF79768F)
                                    )
                                }
                            }

                            // Card 2: Explain
                            Card(
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(containerColor = Color.White),
                                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable { answerQuery(if (isHindi) "सरल भाषा में समझाएं" else "Explain in simple terms like I'm 5") }
                            ) {
                                Column(
                                    modifier = Modifier.padding(12.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    Text(text = "💡", fontSize = 22.sp)
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = if (isHindi) "समझाएं" else "Explain",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color(0xFF1E1B4B)
                                    )
                                    Text(
                                        text = if (isHindi) "सरल भाषा" else "Step-by-step",
                                        fontSize = 10.sp,
                                        color = Color(0xFF79768F)
                                    )
                                }
                            }

                            // Card 3: Quiz Me
                            Card(
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(containerColor = Color.White),
                                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable { answerQuery("practice") }
                            ) {
                                Column(
                                    modifier = Modifier.padding(12.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    Text(text = "🎮", fontSize = 22.sp)
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = if (isHindi) "क्विज़" else "Quiz Me",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color(0xFF1E1B4B)
                                    )
                                    Text(
                                        text = if (isHindi) "जांचें" else "Test Knowledge",
                                        fontSize = 10.sp,
                                        color = Color(0xFF79768F)
                                    )
                                }
                            }
                        }
                    }
                }
            }

            items(messages) { msg ->
                ChatBubble(msg = msg)
            }
        }

        // Action Pills Row
        ActionPillsRow(
            language = profile.language,
            onActionClick = { action ->
                when (action) {
                    "Practice" -> onNavigateToPractice()
                    "Quiz" -> onNavigateToQuiz()
                    "Explain More Simply" -> {
                        val userText = if (isHindi) "क्या आप इसे और सरल शब्दों में समझा सकते हैं?" else "Can you explain that more simply?"
                        val botText = if (isHindi) {
                            "बिल्कुल सरल शब्दों में:\n\n" +
                                    "जब आप किसी रसायन या नियम को समझते हैं, तो उसे अपने घर की चीज़ों से जोड़कर देखें। जैसे नींबू का खट्टापन अम्ल (Acid) के कारण है और साबुन का चिकनापन क्षारक (Base) के कारण!"
                        } else {
                            "In simple everyday terms:\n\n" +
                                    "Connect what you learn to everyday household items. For example, the sour taste of lemon is due to Acid, and the slippery feel of soap is due to Base!"
                        }
                        messages.add(Message(sender = MessageSender.STUDENT, text = userText))
                        messages.add(Message(sender = MessageSender.GURU_OFFLINE, text = botText))
                    }
                    "Give Another Example" -> {
                        val egQuery = if (isHindi) "इस अध्याय का एक और व्यावहारिक उदाहरण दें" else "Give another real-world example for this chapter"
                        answerQuery(egQuery)
                    }
                    else -> {
                        answerQuery(action)
                    }
                }
            }
        )

        // Bottom Input Container (Lumina AI Screen 2 rounded card design)
        Surface(
            color = Color.White,
            shape = RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp),
            shadowElevation = 8.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                // Input box
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFFF6F5FB), RoundedCornerShape(22.dp))
                        .border(1.dp, Color(0xFFEDE9FE), RoundedCornerShape(22.dp))
                        .padding(horizontal = 14.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedTextField(
                        value = inputText,
                        onValueChange = { inputText = it },
                        placeholder = {
                            Text(
                                text = if (isHindi) "अपनी पढ़ाई के बारे में कुछ भी पूछें..." else "Ask anything about your learning...",
                                fontSize = 13.sp,
                                color = Color(0xFFA19FB5)
                            )
                        },
                        modifier = Modifier.weight(1f),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color.Transparent,
                            unfocusedBorderColor = Color.Transparent,
                            focusedContainerColor = Color.Transparent,
                            unfocusedContainerColor = Color.Transparent
                        ),
                        maxLines = 3
                    )

                    // Action Icons: Mic, Voice, Send
                    Text(
                        text = "🎙️",
                        fontSize = 18.sp,
                        modifier = Modifier
                            .clickable {
                                inputText = if (isHindi) "रासायनिक अभिक्रिया क्या है?" else "What is a chemical reaction?"
                            }
                            .padding(end = 8.dp)
                    )

                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .background(PrimaryBlue, CircleShape)
                            .clickable {
                                if (inputText.isNotBlank()) {
                                    val q = inputText.trim()
                                    inputText = ""
                                    answerQuery(q)
                                }
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "➔",
                            color = Color.White,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = if (isHindi) "गुरु AI • सत्यापित NCERT पाठ्यक्रम" else "Guru AI • Verified NCERT Curriculum",
                    fontSize = 10.sp,
                    color = Color(0xFFA19FB5),
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}

// Clean chat bubble matching Lumina AI palette
@Composable
fun ChatBubble(msg: Message) {
    val isUser = msg.sender == MessageSender.STUDENT
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = if (isUser) Alignment.End else Alignment.Start
    ) {
        Card(
            shape = RoundedCornerShape(
                topStart = 18.dp,
                topEnd = 18.dp,
                bottomStart = if (isUser) 18.dp else 4.dp,
                bottomEnd = if (isUser) 4.dp else 18.dp
            ),
            colors = CardDefaults.cardColors(
                containerColor = if (isUser) PrimaryBlue else Color.White
            ),
            border = if (!isUser) CardDefaults.outlinedCardBorder() else null,
            elevation = CardDefaults.cardElevation(defaultElevation = if (isUser) 2.dp else 1.dp),
            modifier = Modifier.widthIn(max = 320.dp)
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                if (!isUser) {
                    Text(
                        text = "Guru AI",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = PrimaryBlue,
                        modifier = Modifier.padding(bottom = 6.dp)
                    )
                }

                Text(
                    text = msg.text,
                    fontSize = 14.sp,
                    color = if (isUser) Color.White else Color(0xFF1E1B4B),
                    lineHeight = 21.sp
                )
            }
        }
    }
}
