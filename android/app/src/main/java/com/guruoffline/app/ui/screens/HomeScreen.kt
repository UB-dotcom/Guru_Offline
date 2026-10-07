package com.guruoffline.app.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.guruoffline.app.R
import com.guruoffline.app.profile.ProfileManager
import com.guruoffline.app.ui.theme.EmeraldGreen
import com.guruoffline.app.ui.theme.PrimaryPurple

@Composable
fun HomeScreen(
    profileManager: ProfileManager,
    onNavigateToChat: (initialPrompt: String?) -> Unit,
    onNavigateToModules: () -> Unit,
    onNavigateToPractice: () -> Unit,
    onNavigateToQuiz: () -> Unit,
    onNavigateToProgress: () -> Unit,
    onNavigateToPerformance: () -> Unit,
    onChangeCurriculum: () -> Unit
) {
    val profile = profileManager.getProfile()
    val isHindi = profile.language.lowercase() == "hi"

    // Active subject selection state from user's selected subjects
    var activeSubject by remember(profile.selectedSubjects) {
        mutableStateOf(profile.selectedSubjects.firstOrNull() ?: "science")
    }

    val langLabel = when (profile.language.lowercase()) {
        "hi" -> "Hindi"
        "bilingual" -> "Hinglish"
        else -> "English"
    }
    val boardLabel = profile.board.uppercase() + (if (profile.state != null) " (${profile.state.uppercase()})" else "")

    // Subject metadata helper
    fun getSubjectMeta(code: String): Triple<String, String, String> {
        return when (code.lowercase()) {
            "mathematics" -> Triple("📐", if (isHindi) "गणित (Mathematics)" else "Mathematics", "Class ${profile.classLevel} NCERT")
            "science" -> Triple("🔬", if (isHindi) "विज्ञान (Science)" else "Science", "NCERT 13 Chapters Ready")
            "physics" -> Triple("⚡", if (isHindi) "भौतिकी (Physics)" else "Physics", "Mechanics & Electromagnetism")
            "chemistry" -> Triple("🧪", if (isHindi) "रसायन (Chemistry)" else "Chemistry", "Organic & Inorganic")
            "biology" -> Triple("🧬", if (isHindi) "जीव विज्ञान (Biology)" else "Biology", "Genetics & Physiology")
            "computer_science" -> Triple("💻", if (isHindi) "कंप्यूटर (Computer Science)" else "Computer Science", "Python & Data Structures")
            "social_science" -> Triple("🌍", if (isHindi) "सामाजिक विज्ञान (Social Science)" else "Social Science", "History, Civics & Geo")
            "english" -> Triple("📖", if (isHindi) "अंग्रेज़ी (English)" else "English", "Literature & Grammar")
            "hindi" -> Triple("🇮🇳", if (isHindi) "हिंदी (Hindi)" else "Hindi", "साहित्य व व्याकरण")
            "evs" -> Triple("🌱", if (isHindi) "पर्यावरण (EVS)" else "Environmental Studies", "Our Environment")
            "accountancy" -> Triple("📑", if (isHindi) "लेखाशास्त्र (Accountancy)" else "Accountancy", "Financial Accounts")
            "business_studies" -> Triple("🏢", if (isHindi) "व्यवसाय अध्ययन (BST)" else "Business Studies", "Management & Finance")
            "economics" -> Triple("📈", if (isHindi) "अर्थशास्त्र (Economics)" else "Economics", "Micro & Macro Economics")
            "history" -> Triple("🏛️", if (isHindi) "इतिहास (History)" else "History", "Indian & World History")
            "political_science" -> Triple("⚖️", if (isHindi) "राजनीति विज्ञान (Pol Science)" else "Political Science", "Constitution & World Politics")
            "geography" -> Triple("🗺️", if (isHindi) "भूगोल (Geography)" else "Geography", "Physical & Human Geo")
            "sociology" -> Triple("👥", if (isHindi) "समाजशास्त्र (Sociology)" else "Sociology", "Indian Society")
            else -> Triple("📚", code.replace("_", " ").replaceFirstChar { it.uppercase() }, "Offline Curriculum")
        }
    }

    // Active chapter info helper
    data class ActiveChapterInfo(
        val chapterLabel: String,
        val title: String,
        val description: String,
        val prompt: String,
        val buttonText: String,
        val doubtTitle: String,
        val doubtSub: String
    )

    fun getActiveChapterInfo(sub: String): ActiveChapterInfo {
        return when (sub.lowercase()) {
            "mathematics" -> ActiveChapterInfo(
                chapterLabel = if (isHindi) "अध्याय 4 • द्विघात समीकरण" else "CHAPTER 4 • QUADRATIC EQUATIONS",
                title = if (isHindi) "द्विघात समीकरण (Quadratic Equations)" else "Quadratic Equations",
                description = if (isHindi) "मानक रूप (ax²+bx+c=0), विविक्तकर D=b²-4ac व श्रीधराचार्य सूत्र" else "Standard Form, Discriminant Analysis & Quadratic Formula",
                prompt = if (isHindi) "द्विघात समीकरण और विविक्तकर को सरल भाषा में समझाएं।" else "Explain quadratic equations and the discriminant formula step by step.",
                buttonText = if (isHindi) "द्विघात समीकरण पर गुरु से पूछें ➔" else "Ask Guru About Quadratics ➔",
                doubtTitle = if (isHindi) "द्विघात समीकरण में कोई संशय है?" else "Doubt in Quadratic Equations?",
                doubtSub = if (isHindi) "ऑफ़लाइन गुरु से हिंदी में तुरंत चरण-दर-चरण समाधान पाएं!" else "Tap to ask Guru for an instant English step-by-step breakdown offline!"
            )
            "science" -> ActiveChapterInfo(
                chapterLabel = if (isHindi) "अध्याय 1 • रासायनिक अभिक्रियाएं" else "CHAPTER 1 • CHEMICAL REACTIONS",
                title = if (isHindi) "रासायनिक अभिक्रियाएं एवं समीकरण" else "Chemical Reactions & Equations",
                description = if (isHindi) "अभिक्रियाओं के प्रकार (संयोजन, वियोजन, विस्थापन) व रेडॉक्स" else "Combination, Decomposition, Displacement & Redox reactions",
                prompt = if (isHindi) "रासायनिक अभिक्रिया और समीकरण संतुलन को सरल भाषा में समझाएं।" else "Explain chemical reactions and balancing equations step by step.",
                buttonText = if (isHindi) "रासायनिक अभिक्रिया पर गुरु से पूछें ➔" else "Ask Guru About Reactions ➔",
                doubtTitle = if (isHindi) "रासायनिक अभिक्रिया या प्रकाश में संशय है?" else "Doubt in Chemical Reactions or Light?",
                doubtSub = if (isHindi) "ऑफ़लाइन गुरु से हिंदी में तुरंत चरण-दर-चरण समाधान पाएं!" else "Tap to ask Guru for an instant English step-by-step breakdown offline!"
            )
            "physics" -> ActiveChapterInfo(
                chapterLabel = if (isHindi) "अध्याय 1 • वैद्युत आवेश तथा क्षेत्र" else "CHAPTER 1 • ELECTRIC CHARGES & FIELDS",
                title = if (isHindi) "वैद्युत आवेश तथा क्षेत्र" else "Electric Charges and Fields",
                description = if (isHindi) "कूलॉम का नियम, विद्युत क्षेत्र रेखाएं व गाउस का प्रमेय" else "Coulomb's Law, Electric Field Lines & Gauss's Law",
                prompt = if (isHindi) "कूलॉम का नियम और विद्युत क्षेत्र को सरल भाषा में समझाएं।" else "Explain Coulomb's Law and electric field step by step.",
                buttonText = if (isHindi) "भौतिकी पर गुरु से पूछें ➔" else "Ask Guru About Physics ➔",
                doubtTitle = if (isHindi) "भौतिकी के नियमों में कोई संशय है?" else "Doubt in Electric Charges & Fields?",
                doubtSub = if (isHindi) "ऑफ़लाइन गुरु से हिंदी में तुरंत चरण-दर-चरण समाधान पाएं!" else "Tap to ask Guru for an instant English step-by-step breakdown offline!"
            )
            "chemistry" -> ActiveChapterInfo(
                chapterLabel = if (isHindi) "अध्याय 1 • विलयन" else "CHAPTER 1 • SOLUTIONS",
                title = if (isHindi) "विलयन एवं रासायनिक आबंधन" else "Solutions & Chemical Bonding",
                description = if (isHindi) "मोलरता, राउल्ट का नियम, क्वथनांक उन्नयन व अणुसंख्य गुणधर्म" else "Molarity, Raoult's Law & Colligative Properties",
                prompt = if (isHindi) "विलयन और राउल्ट के नियम को सरल भाषा में समझाएं।" else "Explain solutions and Raoult's Law step by step.",
                buttonText = if (isHindi) "रसायन पर गुरु से पूछें ➔" else "Ask Guru About Chemistry ➔",
                doubtTitle = if (isHindi) "रसायन विज्ञान में कोई संशय है?" else "Doubt in Solutions or Bonding?",
                doubtSub = if (isHindi) "ऑफ़लाइन गुरु से हिंदी में तुरंत चरण-दर-चरण समाधान पाएं!" else "Tap to ask Guru for an instant English step-by-step breakdown offline!"
            )
            "biology" -> ActiveChapterInfo(
                chapterLabel = if (isHindi) "अध्याय 1 • जीवों में जनन व आनुवंशिकी" else "CHAPTER 1 • REPRODUCTION & GENETICS",
                title = if (isHindi) "आनुवंशिकी एवं मेंडल के नियम" else "Genetics and Heredity",
                description = if (isHindi) "मेंडल के एकसंकर संकरण, F₂ अनुपात व डीएनए संरचना" else "Mendel's Laws, Monohybrid Cross 3:1 ratio & DNA",
                prompt = if (isHindi) "मेंडल के आनुवंशिकी नियमों को सरल भाषा में समझाएं।" else "Explain Mendel's laws of inheritance step by step.",
                buttonText = if (isHindi) "जीव विज्ञान पर गुरु से पूछें ➔" else "Ask Guru About Genetics ➔",
                doubtTitle = if (isHindi) "जीव विज्ञान में कोई संशय है?" else "Doubt in Genetics or Life Processes?",
                doubtSub = if (isHindi) "ऑफ़लाइन गुरु से हिंदी में तुरंत चरण-दर-चरण समाधान पाएं!" else "Tap to ask Guru for an instant English step-by-step breakdown offline!"
            )
            "social_science", "history" -> ActiveChapterInfo(
                chapterLabel = if (isHindi) "अध्याय 1 • राष्ट्रवाद का उदय" else "CHAPTER 1 • NATIONALISM IN EUROPE",
                title = if (isHindi) "यूरोप में राष्ट्रवाद का उदय" else "The Rise of Nationalism in Europe",
                description = if (isHindi) "फ्रांसीसी क्रांति, नेपोलियन संहिता व 1848 की क्रांतियां" else "French Revolution, Napoleonic Code & Nation-States",
                prompt = if (isHindi) "यूरोप में राष्ट्रवाद के उदय को सरल भाषा में समझाएं।" else "Explain the rise of nationalism in Europe step by step.",
                buttonText = if (isHindi) "इतिहास पर गुरु से पूछें ➔" else "Ask Guru About History ➔",
                doubtTitle = if (isHindi) "इतिहास या नागरिक शास्त्र में कोई संशय है?" else "Doubt in History or Civics?",
                doubtSub = if (isHindi) "ऑफ़लाइन गुरु से हिंदी में तुरंत चरण-दर-चरण समाधान पाएं!" else "Tap to ask Guru for an instant English step-by-step breakdown offline!"
            )
            "english" -> ActiveChapterInfo(
                chapterLabel = if (isHindi) "अध्याय 1 • A Letter to God" else "CHAPTER 1 • A LETTER TO GOD",
                title = if (isHindi) "Reading Comprehension & Grammar" else "Reading Comprehension & Grammar",
                description = if (isHindi) "पठन बोध, व्याकरण, शब्दावली व उत्तर लेखन" else "Reading comprehension, Active-Passive Voice & Vocabulary",
                prompt = if (isHindi) "A Letter to God पाठ का मुख्य संदेश और व्याकरण नियम समझाएं।" else "Explain the theme of A Letter to God and key grammar rules.",
                buttonText = if (isHindi) "अंग्रेज़ी पर गुरु से पूछें ➔" else "Ask Guru About English ➔",
                doubtTitle = if (isHindi) "अंग्रेज़ी व्याकरण या साहित्य में संशय है?" else "Doubt in English Literature or Grammar?",
                doubtSub = if (isHindi) "ऑफ़लाइन गुरु से हिंदी में तुरंत चरण-दर-चरण समाधान पाएं!" else "Tap to ask Guru for an instant English step-by-step breakdown offline!"
            )
            else -> {
                val displayName = sub.replace("_", " ").replaceFirstChar { it.uppercase() }
                ActiveChapterInfo(
                    chapterLabel = if (isHindi) "अध्याय 1 • मुख्य पाठ्यक्रम" else "CHAPTER 1 • CORE CONCEPTS",
                    title = if (isHindi) "$displayName पाठ्यक्रम" else "$displayName Curriculum",
                    description = if (isHindi) "कक्षा ${profile.classLevel} NCERT के महत्वपूर्ण अध्याय व सिद्धांत" else "Class ${profile.classLevel} core chapters & verified topics",
                    prompt = if (isHindi) "$displayName के मुख्य अध्याय को सरल भाषा में समझाएं।" else "Explain the core concepts of $displayName step by step.",
                    buttonText = if (isHindi) "$displayName पर गुरु से पूछें ➔" else "Ask Guru About $displayName ➔",
                    doubtTitle = if (isHindi) "$displayName में कोई संशय है?" else "Doubt in $displayName?",
                    doubtSub = if (isHindi) "ऑफ़लाइन गुरु से हिंदी में तुरंत चरण-दर-चरण समाधान पाएं!" else "Tap to ask Guru for an instant English step-by-step breakdown offline!"
                )
            }
        }
    }

    val activeInfo = getActiveChapterInfo(activeSubject)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF6F5FB))
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp, vertical = 12.dp)
                .verticalScroll(rememberScrollState())
        ) {
            // 1. TOP HEADER ROW (Avatar, Greeting, Notification Bell)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.weight(1f)
                ) {
                    Box(
                        modifier = Modifier
                            .size(46.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .border(1.5.dp, Color(0xFFDDD6FE), RoundedCornerShape(14.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Image(
                            painter = painterResource(id = R.drawable.app_logo),
                            contentDescription = "Guru AI Logo",
                            modifier = Modifier.fillMaxSize(),
                            contentScale = ContentScale.Crop
                        )
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column {
                        val greeting = if (isHindi) "शुभ प्रभात 👋" else "Good morning 👋"
                        Text(
                            text = "$greeting, ${profile.studentName.ifBlank { if (isHindi) "विद्यार्थी" else "Student" }}",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = Color(0xFF1E1B4B)
                        )
                        Text(
                            text = if (isHindi) "अपनी पढ़ाई जारी रखने के लिए तैयार हैं?" else "Ready to continue your learning journey?",
                            fontSize = 12.sp,
                            color = Color(0xFF79768F)
                        )
                    }
                }

                // Notification Bell
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .background(Color.White, RoundedCornerShape(20.dp))
                        .border(1.dp, Color(0xFFEDE9FE), RoundedCornerShape(20.dp))
                        .clickable { onChangeCurriculum() },
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "🔔", fontSize = 18.sp)
                    Box(
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(top = 9.dp, end = 10.dp)
                            .size(7.dp)
                            .background(Color(0xFF7C5CFC), RoundedCornerShape(3.5.dp))
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // 2. CURRICULUM CONTEXT PILL
            Surface(
                color = Color(0xFFEDE7FE),
                shape = RoundedCornerShape(16.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFDDD6FE)),
                modifier = Modifier.clickable { onChangeCurriculum() }
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text(
                        text = "Class ${profile.classLevel} • $boardLabel • $langLabel" +
                                (if (profile.stream != null) " • ${profile.stream.uppercase()}" else ""),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF7C5CFC)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(text = "✏️", fontSize = 11.sp)
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // 3. STREAK & XP CARD (Lumina Top Card)
            Card(
                shape = RoundedCornerShape(22.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, Color(0xFFEDE9FE), RoundedCornerShape(22.dp))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Left Column: Streak Info & Weekday Dots
                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(32.dp)
                                    .background(Color(0xFFFFF1EB), RoundedCornerShape(16.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = "🔥", fontSize = 16.sp)
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                val streakCount = if (profile.currentStreakDays > 0) profile.currentStreakDays else 12
                                Text(
                                    text = if (isHindi) "$streakCount दिन की स्ट्रीक" else "$streakCount Day Streak",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = Color(0xFF1E1B4B)
                                )
                                Text(
                                    text = if (isHindi) "लगातार अध्ययन! 🔥" else "You're on fire! 🔥",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = Color(0xFFFF7A45)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        // Weekday Dots: M T W T F S S
                        val weekdays = listOf(
                            Pair("M", true),
                            Pair("T", true),
                            Pair("W", true),
                            Pair("T", true),
                            Pair("F", true),
                            Pair("S", true),
                            Pair("S", false)
                        )
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            weekdays.forEach { (day, active) ->
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Box(
                                        modifier = Modifier
                                            .size(8.dp)
                                            .background(
                                                if (active) Color(0xFF7C5CFC) else Color(0xFFE5E2F5),
                                                RoundedCornerShape(4.dp)
                                            )
                                    )
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(
                                        text = day,
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (active) Color(0xFF7C5CFC) else Color(0xFFA19FB5)
                                    )
                                }
                            }
                        }
                    }

                    // Vertical Divider
                    Box(
                        modifier = Modifier
                            .width(1.dp)
                            .height(52.dp)
                            .background(Color(0xFFF0EDFB))
                    )

                    // Right Column: XP Ring & Score
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(start = 14.dp, end = 6.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(34.dp)
                                .background(Color(0xFFF5F3FF), RoundedCornerShape(17.dp))
                                .border(2.dp, Color(0xFF7C5CFC), RoundedCornerShape(17.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = "✨", fontSize = 14.sp)
                        }
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "240 XP",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = Color(0xFF1E1B4B)
                        )
                        Text(
                            text = "+40 today",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF10B981)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // 4. CONTINUE LEARNING SECTION HEADER
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (isHindi) "अध्ययन जारी रखें" else "Continue Learning",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color(0xFF1E1B4B)
                )
                Text(
                    text = if (isHindi) "सभी देखें ›" else "View All ›",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF7C5CFC),
                    modifier = Modifier.clickable { onNavigateToModules() }
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // 5. HERO PURPLE CARD (Continue Learning)
            Card(
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF7C5CFC)),
                elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onNavigateToChat(activeInfo.prompt) }
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(20.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        // Badge
                        Surface(
                            color = Color(0x38FFFFFF),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text(
                                text = activeInfo.chapterLabel,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = Color.White,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 3.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(6.dp))

                        Text(
                            text = activeInfo.title,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = Color.White,
                            lineHeight = 24.sp
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "65% complete",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xE6FFFFFF)
                            )
                            Text(
                                text = "12/16 Lessons",
                                fontSize = 11.sp,
                                color = Color(0xBFFFFFFF)
                            )
                        }

                        Spacer(modifier = Modifier.height(6.dp))

                        // Progress Bar
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(6.dp)
                                .background(Color(0x40FFFFFF), RoundedCornerShape(3.dp))
                        ) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth(0.65f)
                                    .height(6.dp)
                                    .background(Color.White, RoundedCornerShape(3.dp))
                            )
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        // Continue Button
                        Surface(
                            color = Color.White,
                            shape = RoundedCornerShape(20.dp),
                            modifier = Modifier.clickable { onNavigateToChat(activeInfo.prompt) }
                        ) {
                            Text(
                                text = if (isHindi) "पाठ जारी रखें ›" else "Continue Lessons ›",
                                color = Color(0xFF7C5CFC),
                                fontWeight = FontWeight.ExtraBold,
                                fontSize = 12.sp,
                                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Text(text = "📚", fontSize = 48.sp)
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // 6. ASK GURU AI ANYTHING (Lumina Prompts Card)
            Card(
                shape = RoundedCornerShape(22.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, Color(0xFFEDE9FE), RoundedCornerShape(22.dp))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = if (isHindi) "गुरु AI से कुछ भी पूछें" else "Ask Guru AI Anything",
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = Color(0xFF1E1B4B)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Surface(
                                    color = Color(0xFFEDE7FE),
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Text(
                                        text = "OFFLINE",
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.ExtraBold,
                                        color = Color(0xFF7C5CFC),
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                            }
                            Text(
                                text = if (isHindi) "किसी भी विषय को समझें, मुख्य बिंदु जानें या तुरंत क्विज़ बनाएं!" else "Explain a topic, get summaries, or create practice quizzes!",
                                fontSize = 11.sp,
                                color = Color(0xFF79768F),
                                modifier = Modifier.padding(top = 2.dp)
                            )
                        }
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .border(1.dp, Color(0xFFDDD6FE), RoundedCornerShape(10.dp))
                        ) {
                            Image(
                                painter = painterResource(id = R.drawable.app_logo),
                                contentDescription = "Guru AI",
                                modifier = Modifier.fillMaxSize(),
                                contentScale = ContentScale.Crop
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Quick Action Chips Row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            color = Color(0xFFF6F5FB),
                            shape = RoundedCornerShape(14.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFEDE9FE)),
                            modifier = Modifier
                                .weight(1f)
                                .clickable {
                                    onNavigateToChat(if (isHindi) "सरल भाषा में समझाएं" else "Explain in simple terms with an everyday analogy")
                                }
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 8.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.Center
                            ) {
                                Text(text = "💬", fontSize = 12.sp)
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = if (isHindi) "सरल भाषा" else "Explain Simply",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF1E1B4B)
                                )
                            }
                        }

                        Surface(
                            color = Color(0xFFF6F5FB),
                            shape = RoundedCornerShape(14.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFEDE9FE)),
                            modifier = Modifier
                                .weight(1f)
                                .clickable {
                                    onNavigateToChat(if (isHindi) "इस अध्याय का मुख्य सार बताएं" else "Summarise this lesson key points")
                                }
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 8.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.Center
                            ) {
                                Text(text = "📝", fontSize = 12.sp)
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = if (isHindi) "पाठ सार" else "Summarise",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF1E1B4B)
                                )
                            }
                        }

                        Surface(
                            color = Color(0xFFF6F5FB),
                            shape = RoundedCornerShape(14.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFEDE9FE)),
                            modifier = Modifier
                                .weight(1f)
                                .clickable { onNavigateToQuiz() }
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 8.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.Center
                            ) {
                                Text(text = "💡", fontSize = 12.sp)
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = if (isHindi) "क्विज़" else "Quiz",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF1E1B4B)
                                )
                            }
                        }

                        // Arrow Button
                        Box(
                            modifier = Modifier
                                .size(34.dp)
                                .background(Color(0xFF7C5CFC), RoundedCornerShape(17.dp))
                                .clickable { onNavigateToChat(activeInfo.prompt) },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = "➔", fontSize = 14.sp, color = Color.White, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // 7. MY SUBJECTS SECTION HEADER
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (isHindi) "मेरे विषय (${profile.selectedSubjects.size})" else "My Subjects (${profile.selectedSubjects.size})",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color(0xFF1E1B4B)
                )
                Text(
                    text = if (isHindi) "विषय बदलने के लिए टैप करें" else "Tap to switch active subject",
                    fontSize = 11.sp,
                    color = Color(0xFF79768F)
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // 8. HORIZONTAL SUBJECT CAROUSEL
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                profile.selectedSubjects.forEach { subCode ->
                    val isSelected = activeSubject.equals(subCode, ignoreCase = true)
                    val (icon, name, subtitle) = getSubjectMeta(subCode)

                    Card(
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = if (isSelected) Color(0xFF7C5CFC) else Color.White
                        ),
                        elevation = CardDefaults.cardElevation(defaultElevation = if (isSelected) 4.dp else 1.dp),
                        modifier = Modifier
                            .width(160.dp)
                            .clickable { activeSubject = subCode }
                            .border(
                                width = 1.dp,
                                color = if (isSelected) Color(0xFF7C5CFC) else Color(0xFFEDE9FE),
                                shape = RoundedCornerShape(18.dp)
                            )
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(text = icon, fontSize = 24.sp)
                                Surface(
                                    color = if (isSelected) Color(0x38FFFFFF) else Color(0xFFF6F5FB),
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Text(
                                        text = if (isSelected) (if (isHindi) "सक्रिय" else "Active") else "✓ Offline",
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (isSelected) Color.White else Color(0xFF10B981),
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(10.dp))

                            Text(
                                text = name,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isSelected) Color.White else Color(0xFF1E1B4B),
                                maxLines = 1
                            )
                            Text(
                                text = subtitle,
                                fontSize = 10.sp,
                                color = if (isSelected) Color(0xCCFFFFFF) else Color(0xFF79768F),
                                maxLines = 1,
                                modifier = Modifier.padding(top = 2.dp)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // 9. STUDY MODES SECTION
            Text(
                text = if (isHindi) "अध्ययन माध्यम (Study Modes)" else "Study Modes",
                fontSize = 16.sp,
                fontWeight = FontWeight.ExtraBold,
                color = Color(0xFF1E1B4B)
            )
            Spacer(modifier = Modifier.height(10.dp))

            // Action Grid
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                HomeActionCard(
                    title = if (isHindi) "गुरु से पूछें" else "Ask Guru",
                    subtitle = if (isHindi) "AI चरणबद्ध उत्तर" else "Step-by-step AI answers",
                    icon = "💬",
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigateToChat(null) }
                )
                HomeActionCard(
                    title = if (isHindi) "सभी विषय" else "My Subjects",
                    subtitle = if (isHindi) "मॉड्यूल प्रबंधन" else "Download & manage modules",
                    icon = "📚",
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToModules
                )
            }
            Spacer(modifier = Modifier.height(10.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                HomeActionCard(
                    title = if (isHindi) "अभ्यास (Practice)" else "Practice",
                    subtitle = if (isHindi) "पाठ्यक्रम अभ्यास" else "Curriculum exercises",
                    icon = "✏️",
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToPractice
                )
                HomeActionCard(
                    title = if (isHindi) "क्विज़ मोड" else "Quiz Mode",
                    subtitle = if (isHindi) "5-प्रश्नों के टेस्ट" else "5-Question tests",
                    icon = "🎯",
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToQuiz
                )
            }
            Spacer(modifier = Modifier.height(10.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                HomeActionCard(
                    title = if (isHindi) "प्रगति (Progress)" else "Progress",
                    subtitle = if (isHindi) "अंक व आंकड़े" else "Scores & learning stats",
                    icon = "📊",
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToProgress
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // 10. DYNAMIC DOUBT PROMO CARD
            Card(
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onNavigateToChat(activeInfo.prompt) }
                    .border(1.dp, Color(0xFFEDE9FE), RoundedCornerShape(18.dp))
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .background(Color(0xFFEDE7FE), RoundedCornerShape(19.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "💡", fontSize = 20.sp)
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = activeInfo.doubtTitle,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF1E1B4B)
                        )
                        Text(
                            text = activeInfo.doubtSub,
                            fontSize = 11.sp,
                            color = Color(0xFF79768F)
                        )
                    }
                    Box(
                        modifier = Modifier
                            .size(30.dp)
                            .background(Color(0xFFEDE7FE), RoundedCornerShape(15.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "➔", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF7C5CFC))
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))
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
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = modifier
            .clickable { onClick() }
            .border(1.dp, Color(0xFFEDE9FE), RoundedCornerShape(18.dp))
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Text(text = icon, fontSize = 24.sp)
            Spacer(modifier = Modifier.height(6.dp))
            Text(text = title, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1E1B4B))
            Text(text = subtitle, fontSize = 11.sp, color = Color(0xFF79768F))
        }
    }
}
