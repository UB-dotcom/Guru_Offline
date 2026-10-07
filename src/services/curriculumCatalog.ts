/**
 * Curriculum Catalog Service
 *
 * Sourced directly from the offline SQLite curriculum database.
 * Does NOT use hardcoded curriculum arrays; loads dynamically
 * from curriculumDbService.
 */

import { Board, StateOption, BoardType, StreamType, AppLanguage } from '../types/student';
import { CurriculumSubject } from '../types/curriculum';
import { LearningModule } from '../types/module';
import {
  getDbBoards,
  getDbStates,
  getDbStreams,
  getDbSubjectsForProfile,
  getDbModulesForProfile,
} from './curriculumDbService';

// Database-backed boards, states, and streams
export const SUPPORTED_BOARDS: Board[] = getDbBoards();
export const SUPPORTED_STATES: StateOption[] = getDbStates();
export const SUPPORTED_STREAMS = getDbStreams();

/**
 * Retrieve subjects available in the database for the given student profile.
 * Only returns subjects that actually exist with verified content chunks.
 */
export function getSubjectsForProfile(
  board: BoardType,
  state: string | null,
  classLevel: number,
  stream: StreamType,
  language: AppLanguage
): CurriculumSubject[] {
  return getDbSubjectsForProfile(board, state, classLevel, stream, language);
}

/**
 * Filter learning modules from the curriculum database for the student's profile.
 */
export function filterModulesForProfile(
  _modules: LearningModule[],
  board: BoardType,
  state: string | null,
  classLevel: number,
  stream: StreamType,
  selectedSubjects: string[],
  language: AppLanguage
): LearningModule[] {
  return getDbModulesForProfile(
    board,
    state,
    classLevel,
    stream,
    selectedSubjects,
    language
  );
}
