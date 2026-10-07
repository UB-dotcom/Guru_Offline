-- Final DDL Schema for OfflineTutorAI Multi-Curriculum Database
-- SQLite 3 / FTS5 Compatible

PRAGMA foreign_keys = ON;

-- 1. Curriculum Packages Table
CREATE TABLE IF NOT EXISTS curriculum_packages (
    id TEXT PRIMARY KEY,               -- e.g. "general-class7-science"
    board TEXT NOT NULL,                -- e.g. "General", "CBSE", "ICSE"
    class_level TEXT NOT NULL,          -- e.g. "Class 7", "Class 8"
    subject TEXT NOT NULL,              -- e.g. "Science", "Mathematics"
    name TEXT NOT NULL,                 -- Human-readable package name
    version TEXT NOT NULL DEFAULT '1.0',-- Version string e.g. "1.0", "1.1"
    status TEXT NOT NULL DEFAULT 'PROCESSING', -- "PROCESSING", "READY", "PUBLISHED", "FAILED", "ARCHIVED"
    source_file TEXT NOT NULL,          -- Source PDF filename
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Curriculum Versions Table
CREATE TABLE IF NOT EXISTS curriculum_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    curriculum_id TEXT NOT NULL,
    version TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    FOREIGN KEY(curriculum_id) REFERENCES curriculum_packages(id) ON DELETE CASCADE
);

-- 3. Curriculum Chunks Table
CREATE TABLE IF NOT EXISTS curriculum_chunks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    curriculum_id TEXT NOT NULL,
    board TEXT NOT NULL,
    class TEXT NOT NULL,
    subject TEXT NOT NULL,
    chapter TEXT NOT NULL,
    topic TEXT NOT NULL,
    content TEXT NOT NULL,
    source_page TEXT NOT NULL,
    chunk_id TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(curriculum_id) REFERENCES curriculum_packages(id) ON DELETE CASCADE
);

-- Indexes for Metadata Filtering Performance
CREATE INDEX IF NOT EXISTS idx_chunks_curriculum_id ON curriculum_chunks(curriculum_id);
CREATE INDEX IF NOT EXISTS idx_chunks_subject ON curriculum_chunks(subject);
CREATE INDEX IF NOT EXISTS idx_chunks_class ON curriculum_chunks(class);
CREATE INDEX IF NOT EXISTS idx_chunks_board ON curriculum_chunks(board);
CREATE INDEX IF NOT EXISTS idx_chunks_chapter ON curriculum_chunks(chapter);

-- 4. Full Text Search Virtual Table (FTS5)
CREATE VIRTUAL TABLE IF NOT EXISTS curriculum_chunks_fts USING fts5(
    chunk_id UNINDEXED,
    curriculum_id,
    board,
    class,
    subject,
    chapter,
    topic,
    content,
    content='curriculum_chunks',
    content_rowid='id'
);

-- FTS Synchronization Triggers

CREATE TRIGGER IF NOT EXISTS curriculum_chunks_ai AFTER INSERT ON curriculum_chunks BEGIN
    INSERT INTO curriculum_chunks_fts(rowid, chunk_id, curriculum_id, board, class, subject, chapter, topic, content)
    VALUES (new.id, new.chunk_id, new.curriculum_id, new.board, new.class, new.subject, new.chapter, new.topic, new.content);
END;

CREATE TRIGGER IF NOT EXISTS curriculum_chunks_ad AFTER DELETE ON curriculum_chunks BEGIN
    INSERT INTO curriculum_chunks_fts(curriculum_chunks_fts, rowid, chunk_id, curriculum_id, board, class, subject, chapter, topic, content)
    VALUES('delete', old.id, old.chunk_id, old.curriculum_id, old.board, old.class, old.subject, old.chapter, old.topic, old.content);
END;

CREATE TRIGGER IF NOT EXISTS curriculum_chunks_au AFTER UPDATE ON curriculum_chunks BEGIN
    INSERT INTO curriculum_chunks_fts(curriculum_chunks_fts, rowid, chunk_id, curriculum_id, board, class, subject, chapter, topic, content)
    VALUES('delete', old.id, old.chunk_id, old.curriculum_id, old.board, old.class, old.subject, old.chapter, old.topic, old.content);
    INSERT INTO curriculum_chunks_fts(rowid, chunk_id, curriculum_id, board, class, subject, chapter, topic, content)
    VALUES(new.id, new.chunk_id, new.curriculum_id, new.board, new.class, new.subject, new.chapter, new.topic, new.content);
END;
