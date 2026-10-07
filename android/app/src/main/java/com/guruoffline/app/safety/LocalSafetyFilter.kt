package com.guruoffline.app.safety

data class SafetyResult(
    val isSafe: Boolean,
    val safeResponse: String = "",
    val category: String = "safe"
)

class LocalSafetyFilter {

    private val dangerousRegex = listOf(
        Regex("\\b(make|build|create|synthesize)\\s+(a\\s+)?(bomb|explosive|poison|weapon|gun|meth|drug)\\b", RegexOption.IGNORE_CASE),
        Regex("\\b(how\\s+to\\s+commit\\s+suicide|kill\\s+myself|harm\\s+myself|cut\\s+myself)\\b", RegexOption.IGNORE_CASE),
        Regex("\\b(hack|crack|bypass|steal|ddos)\\s+(wifi|password|account|bank|server)\\b", RegexOption.IGNORE_CASE)
    )

    private val profanityRegex = listOf(
        Regex("\\b(fuck|shit|bitch|bastard|asshole|cunt|dick|pussy)\\b", RegexOption.IGNORE_CASE),
        Regex("\\b(chutiya|bhenchod|madarchod|gaand|harami)\\b", RegexOption.IGNORE_CASE)
    )

    private val cheatingRegex = listOf(
        Regex("\\b(give\\s+me\\s+the\\s+answers\\s+to\\s+my\\s+live\\s+exam|leak\\s+board\\s+paper|cheat\\s+on\\s+test)\\b", RegexOption.IGNORE_CASE)
    )

    private val offTopicRegex = listOf(
        Regex("\\b(who\\s+won\\s+ipl|cricket\\s+score|movie\\s+review|actor\\s+gossip|play\\s+minecraft)\\b", RegexOption.IGNORE_CASE)
    )

    fun evaluate(query: String): SafetyResult {
        val trimmed = query.trim()
        if (trimmed.isEmpty()) {
            return SafetyResult(false, "Please type a curriculum question!", "empty")
        }

        // 1. Harmful / Dangerous
        for (pattern in dangerousRegex) {
            if (pattern.containsMatchIn(trimmed)) {
                return SafetyResult(
                    isSafe = false,
                    safeResponse = "I cannot assist with queries involving weapons, dangerous substances, or harm. " +
                            "If you need help, please reach out to trusted adults or a counselor. " +
                            "I am here to help you learn science, math, and school subjects safely.",
                    category = "dangerous"
                )
            }
        }

        // 2. Profanity
        for (pattern in profanityRegex) {
            if (pattern.containsMatchIn(trimmed)) {
                return SafetyResult(
                    isSafe = false,
                    safeResponse = "Let's keep our learning space polite and respectful! " +
                            "Please rephrase your question so we can focus on your studies.",
                    category = "profanity"
                )
            }
        }

        // 3. Exam Fraud
        for (pattern in cheatingRegex) {
            if (pattern.containsMatchIn(trimmed)) {
                return SafetyResult(
                    isSafe = false,
                    safeResponse = "As your educational tutor, I won't help you bypass exams dishonestly. " +
                            "However, I can explain the underlying concepts step-by-step so you can master them yourself!",
                    category = "academic_integrity"
                )
            }
        }

        // 4. Off-Topic
        for (pattern in offTopicRegex) {
            if (pattern.containsMatchIn(trimmed)) {
                return SafetyResult(
                    isSafe = false,
                    safeResponse = "Guru Offline is dedicated to your school curriculum. " +
                            "Please ask a question related to your downloaded subjects!",
                    category = "off_topic"
                )
            }
        }

        return SafetyResult(isSafe = true)
    }
}
