-- Guru Offline Curriculum Schema
-- SQLite 3 with FTS5 Full-Text Search

-- 1. Boards
CREATE TABLE IF NOT EXISTS boards (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'national',
    description TEXT
);

-- 2. States (for State Board)
CREATE TABLE IF NOT EXISTS states (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    name_hi TEXT,
    board_name TEXT NOT NULL
);

-- 3. Classes (1 to 12)
CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY,
    class_level INTEGER NOT NULL UNIQUE,
    display_name TEXT NOT NULL
);

-- 4. Streams (Senior Secondary Classes 11-12)
CREATE TABLE IF NOT EXISTS streams (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT
);

-- 5. Subjects
CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    board_id TEXT NOT NULL,
    state_id TEXT,
    class_level INTEGER NOT NULL,
    stream_id TEXT,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    name_hi TEXT,
    icon TEXT DEFAULT '📚',
    description TEXT,
    language TEXT DEFAULT 'bilingual',
    is_available INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY(board_id) REFERENCES boards(id),
    FOREIGN KEY(state_id) REFERENCES states(id),
    FOREIGN KEY(class_level) REFERENCES classes(class_level),
    FOREIGN KEY(stream_id) REFERENCES streams(id)
);

-- 6. Chapters
CREATE TABLE IF NOT EXISTS chapters (
    id TEXT PRIMARY KEY,
    subject_id TEXT NOT NULL,
    chapter_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    title_hi TEXT,
    description TEXT,
    is_available INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY(subject_id) REFERENCES subjects(id)
);

-- 7. Modules
CREATE TABLE IF NOT EXISTS modules (
    id TEXT PRIMARY KEY,
    subject_id TEXT NOT NULL,
    chapter_id TEXT,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    size_mb INTEGER DEFAULT 35,
    version TEXT DEFAULT '1.0',
    author TEXT DEFAULT 'NCERT / National Board',
    is_installed INTEGER DEFAULT 0,
    is_available INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY(subject_id) REFERENCES subjects(id),
    FOREIGN KEY(chapter_id) REFERENCES chapters(id)
);

-- 8. Content Chunks (with mandatory cross-curriculum isolation metadata)
CREATE TABLE IF NOT EXISTS content_chunks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chunk_id TEXT NOT NULL UNIQUE,
    module_id TEXT NOT NULL,
    chapter_id TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    board_id TEXT NOT NULL,
    state_id TEXT,
    class_level INTEGER NOT NULL,
    stream_id TEXT,
    language TEXT NOT NULL DEFAULT 'en',
    topic TEXT NOT NULL,
    content TEXT NOT NULL,
    content_hi TEXT,
    source_page TEXT NOT NULL DEFAULT 'NCERT Textbook',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(module_id) REFERENCES modules(id),
    FOREIGN KEY(chapter_id) REFERENCES chapters(id),
    FOREIGN KEY(subject_id) REFERENCES subjects(id),
    FOREIGN KEY(board_id) REFERENCES boards(id),
    FOREIGN KEY(state_id) REFERENCES states(id),
    FOREIGN KEY(stream_id) REFERENCES streams(id)
);

-- Indexes for lightning fast pre-filtering
CREATE INDEX IF NOT EXISTS idx_chunks_board_class_subject ON content_chunks(board_id, class_level, subject_id);
CREATE INDEX IF NOT EXISTS idx_chunks_language ON content_chunks(language);
CREATE INDEX IF NOT EXISTS idx_chunks_module ON content_chunks(module_id);
CREATE INDEX IF NOT EXISTS idx_subjects_board_class ON subjects(board_id, class_level);
CREATE INDEX IF NOT EXISTS idx_modules_subject ON modules(subject_id);

-- 9. FTS5 Virtual Table for Fast On-Device Curriculum Search
CREATE VIRTUAL TABLE IF NOT EXISTS content_chunks_fts USING fts5(
    chunk_id UNINDEXED,
    board_id UNINDEXED,
    state_id UNINDEXED,
    class_level UNINDEXED,
    stream_id UNINDEXED,
    subject_id UNINDEXED,
    chapter_id UNINDEXED,
    module_id UNINDEXED,
    language UNINDEXED,
    topic,
    content,
    content='content_chunks',
    content_rowid='id'
);

-- FTS5 Triggers
CREATE TRIGGER IF NOT EXISTS content_chunks_ai AFTER INSERT ON content_chunks BEGIN
    INSERT INTO content_chunks_fts(rowid, chunk_id, board_id, state_id, class_level, stream_id, subject_id, chapter_id, module_id, language, topic, content)
    VALUES (new.id, new.chunk_id, new.board_id, new.state_id, new.class_level, new.stream_id, new.subject_id, new.chapter_id, new.module_id, new.language, new.topic, new.content);
END;

CREATE TRIGGER IF NOT EXISTS content_chunks_ad AFTER DELETE ON content_chunks BEGIN
    INSERT INTO content_chunks_fts(content_chunks_fts, rowid, chunk_id, board_id, state_id, class_level, stream_id, subject_id, chapter_id, module_id, language, topic, content)
    VALUES('delete', old.id, old.chunk_id, old.board_id, old.state_id, old.class_level, old.stream_id, old.subject_id, old.chapter_id, old.module_id, old.language, old.topic, old.content);
END;

CREATE TRIGGER IF NOT EXISTS content_chunks_au AFTER UPDATE ON content_chunks BEGIN
    INSERT INTO content_chunks_fts(content_chunks_fts, rowid, chunk_id, board_id, state_id, class_level, stream_id, subject_id, chapter_id, module_id, language, topic, content)
    VALUES('delete', old.id, old.chunk_id, old.board_id, old.state_id, old.class_level, old.stream_id, old.subject_id, old.chapter_id, old.module_id, old.language, old.topic, old.content);
    INSERT INTO content_chunks_fts(rowid, chunk_id, board_id, state_id, class_level, stream_id, subject_id, chapter_id, module_id, language, topic, content)
    VALUES(new.id, new.chunk_id, new.board_id, new.state_id, new.class_level, new.stream_id, new.subject_id, new.chapter_id, new.module_id, new.language, new.topic, new.content);
END;
