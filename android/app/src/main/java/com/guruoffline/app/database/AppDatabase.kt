package com.guruoffline.app.database

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

data class AdminSubjectRecord(
    val id: String,
    val name: String,
    val code: String,
    val description: String,
    val board: String,
    val classLevel: Int,
    val stream: String?,
    val language: String,
    val totalChapters: Int = 1,
    val sizeMb: Double = 1.0,
    val createdAt: Long = System.currentTimeMillis()
)

data class AdminChunkRecord(
    val id: String,
    val subjectId: String,
    val chapterId: String,
    val chapterNumber: Int,
    val chapterTitle: String,
    val topic: String,
    val content: String,
    val contentHi: String? = null,
    val explanationEn: String? = null,
    val explanationHi: String? = null,
    val formulaEn: String? = null,
    val formulaHi: String? = null,
    val analogyEn: String? = null,
    val analogyHi: String? = null,
    val practiceEn: String? = null,
    val practiceHi: String? = null,
    val createdAt: Long = System.currentTimeMillis()
)

class AppDatabase(context: Context) : SQLiteOpenHelper(context, "guru_offline.db", null, 2) {

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(
            """
            CREATE TABLE IF NOT EXISTS progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                subject TEXT NOT NULL,
                questions_attempted INTEGER DEFAULT 0,
                completed_pct INTEGER DEFAULT 0,
                quiz_score INTEGER DEFAULT 0,
                last_updated INTEGER
            )
            """.trimIndent()
        )

        db.execSQL(
            """
            CREATE TABLE IF NOT EXISTS profile (
                id INTEGER PRIMARY KEY,
                name TEXT,
                grade INTEGER,
                active_module TEXT,
                language TEXT
            )
            """.trimIndent()
        )

        createAdminTables(db)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        if (oldVersion < 2) {
            createAdminTables(db)
        }
    }

    private fun createAdminTables(db: SQLiteDatabase) {
        db.execSQL(
            """
            CREATE TABLE IF NOT EXISTS admin_subjects (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                code TEXT NOT NULL,
                description TEXT,
                board TEXT NOT NULL,
                class_level INTEGER NOT NULL,
                stream TEXT,
                language TEXT NOT NULL,
                total_chapters INTEGER DEFAULT 1,
                size_mb REAL DEFAULT 1.0,
                created_at INTEGER
            )
            """.trimIndent()
        )

        db.execSQL(
            """
            CREATE TABLE IF NOT EXISTS admin_chunks (
                id TEXT PRIMARY KEY,
                subject_id TEXT NOT NULL,
                chapter_id TEXT NOT NULL,
                chapter_number INTEGER NOT NULL DEFAULT 1,
                chapter_title TEXT NOT NULL,
                topic TEXT NOT NULL,
                content TEXT NOT NULL,
                content_hi TEXT,
                explanation_en TEXT,
                explanation_hi TEXT,
                formula_en TEXT,
                formula_hi TEXT,
                analogy_en TEXT,
                analogy_hi TEXT,
                practice_en TEXT,
                practice_hi TEXT,
                created_at INTEGER
            )
            """.trimIndent()
        )

        try {
            db.execSQL(
                """
                CREATE VIRTUAL TABLE IF NOT EXISTS admin_chunks_fts USING fts4(
                    chunk_id,
                    subject_id,
                    topic,
                    content,
                    formula,
                    analogy
                )
                """.trimIndent()
            )
        } catch (_: Exception) {
            // Virtual table fallback if custom SQLite build lacks FTS module
        }
    }

    fun insertAdminSubject(subject: AdminSubjectRecord) {
        val db = writableDatabase
        val values = ContentValues().apply {
            put("id", subject.id)
            put("name", subject.name)
            put("code", subject.code)
            put("description", subject.description)
            put("board", subject.board)
            put("class_level", subject.classLevel)
            put("stream", subject.stream)
            put("language", subject.language)
            put("total_chapters", subject.totalChapters)
            put("size_mb", subject.sizeMb)
            put("created_at", subject.createdAt)
        }
        db.insertWithOnConflict("admin_subjects", null, values, SQLiteDatabase.CONFLICT_REPLACE)
    }

    fun insertAdminChunk(chunk: AdminChunkRecord) {
        val db = writableDatabase
        val values = ContentValues().apply {
            put("id", chunk.id)
            put("subject_id", chunk.subjectId)
            put("chapter_id", chunk.chapterId)
            put("chapter_number", chunk.chapterNumber)
            put("chapter_title", chunk.chapterTitle)
            put("topic", chunk.topic)
            put("content", chunk.content)
            put("content_hi", chunk.contentHi)
            put("explanation_en", chunk.explanationEn)
            put("explanation_hi", chunk.explanationHi)
            put("formula_en", chunk.formulaEn)
            put("formula_hi", chunk.formulaHi)
            put("analogy_en", chunk.analogyEn)
            put("analogy_hi", chunk.analogyHi)
            put("practice_en", chunk.practiceEn)
            put("practice_hi", chunk.practiceHi)
            put("created_at", chunk.createdAt)
        }
        db.insertWithOnConflict("admin_chunks", null, values, SQLiteDatabase.CONFLICT_REPLACE)

        try {
            val ftsValues = ContentValues().apply {
                put("chunk_id", chunk.id)
                put("subject_id", chunk.subjectId)
                put("topic", chunk.topic)
                put("content", chunk.content)
                put("formula", chunk.formulaEn)
                put("analogy", chunk.analogyEn)
            }
            db.insertWithOnConflict("admin_chunks_fts", null, ftsValues, SQLiteDatabase.CONFLICT_REPLACE)
        } catch (_: Exception) {}
    }

    fun getAllAdminSubjects(): List<AdminSubjectRecord> {
        val list = mutableListOf<AdminSubjectRecord>()
        val db = readableDatabase
        val cursor = db.rawQuery("SELECT * FROM admin_subjects ORDER BY created_at DESC", null)
        cursor.use { c ->
            while (c.moveToNext()) {
                list.add(
                    AdminSubjectRecord(
                        id = c.getString(c.getColumnIndexOrThrow("id")),
                        name = c.getString(c.getColumnIndexOrThrow("name")),
                        code = c.getString(c.getColumnIndexOrThrow("code")),
                        description = c.getString(c.getColumnIndexOrThrow("description")),
                        board = c.getString(c.getColumnIndexOrThrow("board")),
                        classLevel = c.getInt(c.getColumnIndexOrThrow("class_level")),
                        stream = if (c.isNull(c.getColumnIndexOrThrow("stream"))) null else c.getString(c.getColumnIndexOrThrow("stream")),
                        language = c.getString(c.getColumnIndexOrThrow("language")),
                        totalChapters = c.getInt(c.getColumnIndexOrThrow("total_chapters")),
                        sizeMb = c.getDouble(c.getColumnIndexOrThrow("size_mb")),
                        createdAt = c.getLong(c.getColumnIndexOrThrow("created_at"))
                    )
                )
            }
        }
        return list
    }

    fun getChunksForSubject(subjectId: String): List<AdminChunkRecord> {
        val list = mutableListOf<AdminChunkRecord>()
        val db = readableDatabase
        val cursor = db.rawQuery("SELECT * FROM admin_chunks WHERE subject_id = ? ORDER BY chapter_number ASC", arrayOf(subjectId))
        cursor.use { c ->
            while (c.moveToNext()) {
                list.add(
                    AdminChunkRecord(
                        id = c.getString(c.getColumnIndexOrThrow("id")),
                        subjectId = c.getString(c.getColumnIndexOrThrow("subject_id")),
                        chapterId = c.getString(c.getColumnIndexOrThrow("chapter_id")),
                        chapterNumber = c.getInt(c.getColumnIndexOrThrow("chapter_number")),
                        chapterTitle = c.getString(c.getColumnIndexOrThrow("chapter_title")),
                        topic = c.getString(c.getColumnIndexOrThrow("topic")),
                        content = c.getString(c.getColumnIndexOrThrow("content")),
                        contentHi = if (c.isNull(c.getColumnIndexOrThrow("content_hi"))) null else c.getString(c.getColumnIndexOrThrow("content_hi")),
                        explanationEn = if (c.isNull(c.getColumnIndexOrThrow("explanation_en"))) null else c.getString(c.getColumnIndexOrThrow("explanation_en")),
                        explanationHi = if (c.isNull(c.getColumnIndexOrThrow("explanation_hi"))) null else c.getString(c.getColumnIndexOrThrow("explanation_hi")),
                        formulaEn = if (c.isNull(c.getColumnIndexOrThrow("formula_en"))) null else c.getString(c.getColumnIndexOrThrow("formula_en")),
                        formulaHi = if (c.isNull(c.getColumnIndexOrThrow("formula_hi"))) null else c.getString(c.getColumnIndexOrThrow("formula_hi")),
                        analogyEn = if (c.isNull(c.getColumnIndexOrThrow("analogy_en"))) null else c.getString(c.getColumnIndexOrThrow("analogy_en")),
                        analogyHi = if (c.isNull(c.getColumnIndexOrThrow("analogy_hi"))) null else c.getString(c.getColumnIndexOrThrow("analogy_hi")),
                        practiceEn = if (c.isNull(c.getColumnIndexOrThrow("practice_en"))) null else c.getString(c.getColumnIndexOrThrow("practice_en")),
                        practiceHi = if (c.isNull(c.getColumnIndexOrThrow("practice_hi"))) null else c.getString(c.getColumnIndexOrThrow("practice_hi")),
                        createdAt = c.getLong(c.getColumnIndexOrThrow("created_at"))
                    )
                )
            }
        }
        return list
    }

    fun deleteAdminSubject(subjectId: String) {
        val db = writableDatabase
        db.delete("admin_subjects", "id = ?", arrayOf(subjectId))
        db.delete("admin_chunks", "subject_id = ?", arrayOf(subjectId))
        try {
            db.delete("admin_chunks_fts", "subject_id = ?", arrayOf(subjectId))
        } catch (_: Exception) {}
    }
}
