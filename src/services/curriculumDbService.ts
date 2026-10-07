/**
 * Curriculum Database Service (Offline SQLite Data Access)
 *
 * Provides typed, offline access to boards, states, classes, streams,
 * subjects, chapters, modules, and content chunks loaded directly
 * from the curriculum database.
 */

import { Board, StateOption, BoardType, StreamType, AppLanguage } from '../types/student';
import { CurriculumSubject } from '../types/curriculum';
import { LearningModule, Chapter } from '../types/module';

// Load database snapshot generated from SQLite curriculum.db
// Fallback to empty structure if unavailable
let dbSnapshot: any;
try {
  dbSnapshot = require('../data/curriculumDatabase.json');
} catch (e) {
  dbSnapshot = {
    boards: [],
    states: [],
    classes: [],
    streams: [],
    subjects: [],
    chapters: [],
    modules: [],
    content_chunks: []
  };
}

export interface DbSubjectRow {
  id: string;
  board_id: string;
  state_id: string | null;
  class_level: number;
  stream_id: string | null;
  code: string;
  name: string;
  name_hi?: string;
  icon?: string;
  description?: string;
  language?: string;
  is_available: number;
}

export interface DbModuleRow {
  id: string;
  subject_id: string;
  chapter_id: string | null;
  code: string;
  name: string;
  size_mb: number;
  version: string;
  author: string;
  is_installed: number;
  is_available: number;
}

export interface DbChunkRow {
  id: number;
  chunk_id: string;
  module_id: string;
  chapter_id: string;
  subject_id: string;
  board_id: string;
  state_id: string | null;
  class_level: number;
  stream_id: string | null;
  language: string;
  topic: string;
  content: string;
  content_hi?: string;
  source_page?: string;
}

/**
 * Fetch all boards configured in the curriculum database.
 */
export function getDbBoards(): Board[] {
  return (dbSnapshot.boards || []).map((b: any) => ({
    id: b.id as BoardType,
    name: b.name,
    shortName: b.code,
    type: b.type as 'national' | 'state',
    description: b.description || ''
  }));
}

/**
 * Fetch all state boards registered in the database.
 */
export function getDbStates(): StateOption[] {
  return (dbSnapshot.states || []).map((s: any) => ({
    id: s.id,
    name: s.name,
    hindiName: s.name_hi || s.name,
    boardName: s.board_name
  }));
}

/**
 * Fetch all streams registered in the database.
 */
export function getDbStreams(): { id: StreamType; name: string; icon: string; description: string }[] {
  const iconMap: Record<string, string> = {
    science: '🔬',
    commerce: '📊',
    arts: '🎨'
  };
  return (dbSnapshot.streams || []).map((st: any) => ({
    id: st.id as StreamType,
    name: st.name,
    icon: iconMap[st.id] || '📚',
    description: st.description || ''
  }));
}

/**
 * Query subjects from the curriculum database for the student's exact profile.
 * Only returns subjects that exist in the database with is_available = 1.
 */
export function getDbSubjectsForProfile(
  board: BoardType,
  state: string | null,
  classLevel: number,
  stream: StreamType,
  language: AppLanguage
): CurriculumSubject[] {
  const isHindi = language === 'hi' || language === 'bilingual';
  const subjects: DbSubjectRow[] = dbSnapshot.subjects || [];
  const chapters: any[] = dbSnapshot.chapters || [];

  const matched = subjects.filter((s) => {
    // 1. Must be available in database
    if (s.is_available !== 1) return false;

    // 2. Must match board
    if (s.board_id !== board) return false;

    // 3. Must match class level
    if (s.class_level !== classLevel) return false;

    // 4. State Board compatibility: match exact state or general state curriculum
    if (board === 'state' && state && s.state_id && s.state_id !== state && s.state_id !== 'bihar') return false;

    // 5. Must match stream if Classes 11-12 (default to science if stream not yet set)
    const effectiveStream = stream || 'science';
    if (classLevel >= 11 && s.stream_id !== effectiveStream) return false;

    return true;
  });

  return matched.map((s) => {
    const chCount = chapters.filter((ch) => ch.subject_id === s.id && ch.is_available === 1).length;
    return {
      id: s.code, // e.g. 'mathematics', 'physics', 'accountancy'
      name: isHindi && s.name_hi ? s.name_hi : s.name,
      icon: s.icon || '📚',
      description: s.description || `${s.name} Curriculum`,
      chapterCount: chCount > 0 ? chCount : 5,
      totalSizeMB: s.code.includes('math') ? 35 : s.code.includes('science') || s.code.includes('physics') || s.code.includes('chem') ? 42 : 30
    };
  });
}

/**
 * Query modules from the curriculum database for the student's profile and selected subjects.
 */
export function getDbModulesForProfile(
  board: BoardType,
  state: string | null,
  classLevel: number,
  stream: StreamType,
  selectedSubjects: string[],
  language: AppLanguage
): LearningModule[] {
  const isHindi = language === 'hi' || language === 'bilingual';
  const dbModules: DbModuleRow[] = dbSnapshot.modules || [];
  const dbSubjects: DbSubjectRow[] = dbSnapshot.subjects || [];
  const dbChapters: any[] = dbSnapshot.chapters || [];

  // Filter modules that are available and belong to selected subjects
  const available = dbModules.filter((m) => {
    if (m.is_available !== 1) return false;
    // Find parent subject
    const subj = dbSubjects.find((s) => s.id === m.subject_id);
    if (!subj) return false;
    if (subj.board_id !== board || subj.class_level !== classLevel) return false;
    if (board === 'state' && state && subj.state_id && subj.state_id !== state && subj.state_id !== 'bihar') return false;
    const effectiveStream = stream || 'science';
    if (classLevel >= 11 && subj.stream_id !== effectiveStream) return false;
    if (selectedSubjects.length > 0 && !selectedSubjects.includes(subj.code)) return false;
    return true;
  });

  return available.map((m) => {
    const subj = dbSubjects.find((s) => s.id === m.subject_id);
    const relatedChapters = dbChapters.filter((c: any) => c.subject_id === m.subject_id && c.is_available === 1);
    const mappedChapters: Chapter[] = relatedChapters.map((c: any, idx: number) => ({
      id: c.id,
      chapterNumber: c.chapter_number,
      title: isHindi && c.title_hi ? c.title_hi : c.title,
      summary: c.description || `${c.title} overview`,
      content: c.description || `${c.title} core concepts`,
      formulas: [],
      status: idx === 0 ? ('current' as const) : ('unlocked' as const),
      progressPercent: idx === 0 ? 30 : 0,
    }));

    return {
      id: m.code,
      title: m.name,
      classNumber: classLevel,
      subject: subj ? (subj.code === 'mathematics' ? 'Mathematics' : subj.code === 'science' ? 'Science' : subj.name) : 'General',
      totalChapters: mappedChapters.length > 0 ? mappedChapters.length : 3,
      sizeMB: m.size_mb,
      downloaded: m.is_installed === 1,
      downloadProgress: m.is_installed === 1 ? 100 : 0,
      isDownloading: false,
      isPaused: false,
      version: m.version || '1.0',
      curriculumCode: m.code,
      description: subj?.description || `NCERT Class ${classLevel} syllabus`,
      chapters: mappedChapters,
      updatedAt: '2026-10-07',
    };
  });
}

/**
 * Filter chunks strictly by student profile to prevent cross-curriculum retrieval.
 */
export function queryDbChunks(filter: {
  board: string;
  state?: string | null;
  classLevel: number;
  stream?: string | null;
  subject?: string;
  language?: string;
}): DbChunkRow[] {
  const chunks: DbChunkRow[] = dbSnapshot.content_chunks || [];
  const targetBoard = filter.board.toLowerCase();
  const targetSubject = filter.subject ? filter.subject.toLowerCase() : null;

  return chunks.filter((c) => {
    // 1. Board filter
    if (c.board_id.toLowerCase() !== targetBoard) return false;

    // 2. Class Level filter
    if (c.class_level !== filter.classLevel) return false;

    // 3. State filter (for state board)
    if (targetBoard === 'state' && filter.state && c.state_id !== filter.state) return false;

    // 4. Stream filter (for 11/12)
    if (filter.classLevel >= 11 && filter.stream && c.stream_id !== filter.stream) return false;

    // 5. Subject filter
    if (targetSubject && !c.subject_id.toLowerCase().includes(targetSubject)) return false;

    return true;
  });
}
