package com.guruoffline.app.translation

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.io.InputStreamReader

data class NtrexTranslationPair(
    val sourceText: String, // Hindi
    val targetText: String  // English
)

object TranslationService {

    private val vocabulary = mapOf(
        "science" to Pair("विज्ञान", "Science"),
        "mathematics" to Pair("गणित", "Mathematics"),
        "physics" to Pair("भौतिकी", "Physics"),
        "chemistry" to Pair("रसायन विज्ञान", "Chemistry"),
        "biology" to Pair("जीव विज्ञान", "Biology"),
        "chapter" to Pair("अध्याय", "Chapter"),
        "question" to Pair("प्रश्न", "Question"),
        "answer" to Pair("उत्तर", "Answer"),
        "formula" to Pair("सूत्र", "Formula"),
        "equation" to Pair("समीकरण", "Equation"),
        "reaction" to Pair("अभिक्रिया", "Reaction"),
        "acid" to Pair("अम्ल", "Acid"),
        "base" to Pair("क्षारक", "Base"),
        "salt" to Pair("लवण", "Salt"),
        "metal" to Pair("धातु", "Metal"),
        "non-metal" to Pair("अधातु", "Non-metal"),
        "electricity" to Pair("विद्युत", "Electricity"),
        "light" to Pair("प्रकाश", "Light"),
        "reflection" to Pair("परावर्तन", "Reflection"),
        "refraction" to Pair("अपवर्तन", "Refraction"),
        "cell" to Pair("कोशिका", "Cell"),
        "tissue" to Pair("ऊतक", "Tissue"),
        "energy" to Pair("ऊर्जा", "Energy"),
        "force" to Pair("बल", "Force"),
        "work" to Pair("कार्य", "Work"),
        "power" to Pair("शक्ति", "Power"),
        "quadratic" to Pair("द्विघात", "Quadratic"),
        "polynomial" to Pair("बहुपद", "Polynomial"),
        "real" to Pair("वास्तविक", "Real"),
        "number" to Pair("संख्या", "Number"),
        "triangle" to Pair("त्रिभुज", "Triangle"),
        "circle" to Pair("वृत्त", "Circle"),
        "practice" to Pair("अभ्यास", "Practice"),
        "quiz" to Pair("प्रश्नोत्तरी", "Quiz"),
        "progress" to Pair("प्रगति", "Progress"),
        "summary" to Pair("सारांश", "Summary"),
        "explanation" to Pair("स्पष्टीकरण", "Explanation"),
        "example" to Pair("उदाहरण", "Example")
    )

    private var benchmarkPairs: List<NtrexTranslationPair> = emptyList()
    private var isLoaded = false

    fun init(context: Context) {
        if (isLoaded) return
        try {
            context.assets.open("ntrex_translations.json").use { inputStream ->
                InputStreamReader(inputStream, Charsets.UTF_8).use { reader ->
                    val type = object : TypeToken<List<NtrexTranslationPair>>() {}.type
                    benchmarkPairs = Gson().fromJson(reader, type)
                    isLoaded = true
                }
            }
        } catch (_: Exception) {
            // Assets not yet accessible or fallback
        }
    }

    fun isHindiText(text: String): Boolean {
        return text.any { it in '\u0900'..'\u097F' }
    }

    /**
     * Translates English text to Hindi using the NTREX benchmark dataset & vocabulary map.
     */
    fun translateEnglishToHindi(englishText: String): String {
        val query = englishText.trim().lowercase()
        if (query.isBlank()) return ""

        // 1. Direct vocabulary match
        vocabulary[query]?.let { return it.first }

        // 2. Exact match in NTREX benchmark
        benchmarkPairs.firstOrNull { it.targetText.trim().equals(query, ignoreCase = true) }?.let {
            return it.sourceText
        }

        // 3. Substring match in NTREX benchmark
        benchmarkPairs.firstOrNull { it.targetText.lowercase().contains(query) }?.let {
            return it.sourceText
        }

        // 4. Token-by-token replacement fallback
        val tokens = englishText.split(Regex("(?<=\\s)|(?=\\s)|(?<=[.,!?;:()])|(?=[.,!?;:()])"))
        return tokens.joinToString("") { token ->
            vocabulary[token.lowercase()]?.first ?: token
        }
    }

    /**
     * Translates Hindi text to English using the NTREX benchmark dataset & vocabulary map.
     */
    fun translateHindiToEnglish(hindiText: String): String {
        val query = hindiText.trim()
        if (query.isBlank()) return ""

        // 1. Direct vocabulary match
        vocabulary.values.firstOrNull { it.first == query }?.let {
            return it.second
        }

        // 2. Exact match in NTREX benchmark
        benchmarkPairs.firstOrNull { it.sourceText.trim() == query }?.let {
            return it.targetText
        }

        // 3. Substring match in NTREX benchmark
        benchmarkPairs.firstOrNull { it.sourceText.contains(query) }?.let {
            return it.targetText
        }

        // 4. Token-by-token replacement fallback
        val tokens = hindiText.split(Regex("(?<=\\s)|(?=\\s)|(?<=[.,!?;:()।])|(?=[.,!?;:()।])"))
        return tokens.joinToString("") { token ->
            vocabulary.values.firstOrNull { it.first == token }?.second ?: token
        }
    }

    /**
     * Translates text according to the student's selected language ('en' -> English, 'hi' -> Hindi).
     */
    fun translateAccordingToLanguage(text: String, targetLanguage: String): String {
        return when (targetLanguage.lowercase()) {
            "en" -> if (isHindiText(text)) translateHindiToEnglish(text) else text
            "hi" -> if (!isHindiText(text)) translateEnglishToHindi(text) else text
            else -> text
        }
    }

    /**
     * Search benchmark for examples of how a term is used in Hindi and English.
     */
    fun searchBenchmark(query: String, limit: Int = 3): List<NtrexTranslationPair> {
        val q = query.trim().lowercase()
        if (q.isBlank()) return emptyList()

        return benchmarkPairs.filter {
            it.targetText.lowercase().contains(q) || it.sourceText.contains(query)
        }.take(limit)
    }
}
