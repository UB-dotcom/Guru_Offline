package com.guruoffline.app.rag

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.io.File
import kotlin.math.ln
import kotlin.math.max

data class DocumentChunk(
    val chunk_id: String,
    val type: String,
    val topic: String,
    val title: String,
    val content: String,
    var bm25_score: Float = 0f
)

data class InvertedPosting(
    val doc_id: Int,
    val tf: Int
)

data class IndexData(
    val total_docs: Int,
    val avg_dl: Float,
    val doc_lengths: List<Int>,
    val idf: Map<String, Float>,
    val inverted_index: Map<String, List<InvertedPosting>>
)

class LocalRagRetriever(private val baseModulesDir: File) {

    private val gson = Gson()
    private val loadedChunks = mutableMapOf<String, List<DocumentChunk>>()
    private val loadedIndices = mutableMapOf<String, IndexData>()

    private val stopWords = setOf(
        "a", "an", "the", "and", "or", "in", "on", "at", "to", "for", "of", "with",
        "is", "are", "was", "were", "what", "how", "why", "who", "when", "this", "that"
    )

    fun loadModule(moduleId: String): Boolean {
        if (loadedChunks.containsKey(moduleId)) return true

        val modDir = File(baseModulesDir, moduleId)
        val indexPath = File(modDir, "embeddings/index/index.json")
        val chunksPath = File(modDir, "embeddings/index/chunks.json")

        if (!indexPath.exists() || !chunksPath.exists()) return false

        try {
            val indexJson = indexPath.readText()
            val chunksJson = chunksPath.readText()

            val indexData: IndexData = gson.fromJson(indexJson, IndexData::class.java)
            val chunkListType = object : TypeToken<List<DocumentChunk>>() {}.type
            val chunks: List<DocumentChunk> = gson.fromJson(chunksJson, chunkListType)

            loadedIndices[moduleId] = indexData
            loadedChunks[moduleId] = chunks
            return true
        } catch (e: Exception) {
            e.printStackTrace()
            return false
        }
    }

    private fun tokenize(text: String): List<String> {
        val regex = Regex("[a-zA-Z0-9_\\^\\+\\-\\*/=\\.]+")
        return regex.findAll(text.lowercase())
            .map { it.value }
            .filter { it.length > 1 && !stopWords.contains(it) }
            .toList()
    }

    fun retrieve(moduleId: String, query: String, topK: Int = 2): List<DocumentChunk> {
        if (!loadModule(moduleId)) return emptyList()

        val index = loadedIndices[moduleId] ?: return emptyList()
        val chunks = loadedChunks[moduleId] ?: return emptyList()

        val tokens = tokenize(query)
        if (tokens.isEmpty()) return emptyList()

        val k1 = 1.5f
        val b = 0.75f
        val avgDl = index.avg_dl
        val scores = FloatArray(chunks.size)

        for (term in tokens) {
            val postings = index.inverted_index[term] ?: continue
            val idf = index.idf[term] ?: 1.0f

            for (p in postings) {
                val docId = p.doc_id
                if (docId < chunks.size) {
                    val tf = p.tf.toFloat()
                    val docLen = if (docId < index.doc_lengths.size) index.doc_lengths[docId].toFloat() else avgDl
                    val tfScore = (tf * (k1 + 1f)) / (tf + k1 * (1f - b + b * (docLen / avgDl)))
                    scores[docId] += idf * tfScore
                }
            }
        }

        val ranked = chunks.indices
            .filter { scores[it] > 0 }
            .sortedByDescending { scores[it] }
            .take(topK)
            .map { idx ->
                chunks[idx].copy(bm25_score = scores[idx])
            }

        return if (ranked.isNotEmpty()) ranked else chunks.take(1)
    }
}
