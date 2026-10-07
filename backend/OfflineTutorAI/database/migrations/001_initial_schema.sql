-- Migration 001: Initial Schema Setup
-- Applies baseline curriculum_chunks table and FTS5 search index.

CREATE TABLE IF NOT EXISTS curriculum_chunks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    board TEXT NOT NULL,
    class TEXT NOT NULL,
    subject TEXT NOT NULL,
    chapter TEXT NOT NULL,
    topic TEXT NOT NULL,
    content TEXT NOT NULL,
    source_page TEXT NOT NULL,
    chunk_id TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chunks_subject ON curriculum_chunks(subject);
CREATE INDEX IF NOT EXISTS idx_chunks_class ON curriculum_chunks(class);
CREATE INDEX IF NOT EXISTS idx_chunks_board ON curriculum_chunks(board);
CREATE INDEX IF NOT EXISTS idx_chunks_chapter ON curriculum_chunks(chapter);

CREATE VIRTUAL TABLE IF NOT EXISTS curriculum_chunks_fts USING fts5(
    chunk_id UNINDEXED,
    subject,
    chapter,
    topic,
    content,
    content='curriculum_chunks',
    content_rowid='id'
);
