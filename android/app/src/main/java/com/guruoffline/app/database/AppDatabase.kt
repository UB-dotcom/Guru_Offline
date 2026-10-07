package com.guruoffline.app.database

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class AppDatabase(context: Context) : SQLiteOpenHelper(context, "guru_offline.db", null, 1) {

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
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS progress")
        db.execSQL("DROP TABLE IF EXISTS profile")
        onCreate(db)
    }
}
