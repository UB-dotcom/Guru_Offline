/**
 * Guru Offline NTREX Translation Service
 *
 * Uses the local NTREX-128 English-Hindi benchmark parallel dataset
 * to perform fast on-device translation between English and Hindi,
 * respecting the student's selected language.
 */

import ntrexData from '../data/ntrex_translations.json';

export interface TranslationPair {
  sourceText: string; // Hindi
  targetText: string; // English
}

const pairs: TranslationPair[] = ntrexData as TranslationPair[];

// Common educational & science bilingual dictionary for instant exact mapping
const VOCABULARY_MAP: Record<string, { hi: string; en: string }> = {
  science: { hi: 'विज्ञान', en: 'Science' },
  mathematics: { hi: 'गणित', en: 'Mathematics' },
  physics: { hi: 'भौतिकी', en: 'Physics' },
  chemistry: { hi: 'रसायन विज्ञान', en: 'Chemistry' },
  biology: { hi: 'जीव विज्ञान', en: 'Biology' },
  chapter: { hi: 'अध्याय', en: 'Chapter' },
  question: { hi: 'प्रश्न', en: 'Question' },
  answer: { hi: 'उत्तर', en: 'Answer' },
  formula: { hi: 'सूत्र', en: 'Formula' },
  equation: { hi: 'समीकरण', en: 'Equation' },
  reaction: { hi: 'अभिक्रिया', en: 'Reaction' },
  acid: { hi: 'अम्ल', en: 'Acid' },
  base: { hi: 'क्षारक', en: 'Base' },
  salt: { hi: 'लवण', en: 'Salt' },
  metal: { hi: 'धातु', en: 'Metal' },
  nonmetal: { hi: 'अधातु', en: 'Non-metal' },
  electricity: { hi: 'विद्युत', en: 'Electricity' },
  light: { hi: 'प्रकाश', en: 'Light' },
  reflection: { hi: 'परावर्तन', en: 'Reflection' },
  refraction: { hi: 'अपवर्तन', en: 'Refraction' },
  cell: { hi: 'कोशिका', en: 'Cell' },
  tissue: { hi: 'ऊतक', en: 'Tissue' },
  energy: { hi: 'ऊर्जा', en: 'Energy' },
  force: { hi: 'बल', en: 'Force' },
  work: { hi: 'कार्य', en: 'Work' },
  power: { hi: 'शक्ति', en: 'Power' },
  quadratic: { hi: 'द्विघात', en: 'Quadratic' },
  polynomial: { hi: 'बहुपद', en: 'Polynomial' },
  real: { hi: 'वास्तविक', en: 'Real' },
  number: { hi: 'संख्या', en: 'Number' },
  triangle: { hi: 'त्रिभुज', en: 'Triangle' },
  circle: { hi: 'वृत्त', en: 'Circle' },
  practice: { hi: 'अभ्यास', en: 'Practice' },
  quiz: { hi: 'प्रश्नोत्तरी', en: 'Quiz' },
  progress: { hi: 'प्रगति', en: 'Progress' },
  summary: { hi: 'सारांश', en: 'Summary' },
  explanation: { hi: 'स्पष्टीकरण', en: 'Explanation' },
  example: { hi: 'उदाहरण', en: 'Example' },
};

/**
 * Check if text contains Devanagari (Hindi) script characters.
 */
export function isHindiText(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Translate English text to Hindi using the NTREX parallel corpus & vocabulary map.
 */
export function translateEnglishToHindi(englishText: string): string {
  const query = englishText.trim().toLowerCase();
  if (!query) return '';

  // 1. Direct vocabulary match
  if (VOCABULARY_MAP[query]) {
    return VOCABULARY_MAP[query].hi;
  }

  // 2. Exact match in NTREX benchmark
  const exact = pairs.find(
    (p) => p.targetText.trim().toLowerCase() === query
  );
  if (exact) {
    return exact.sourceText;
  }

  // 3. Partial sentence match in NTREX benchmark
  const found = pairs.find((p) =>
    p.targetText.toLowerCase().includes(query)
  );
  if (found) {
    return found.sourceText;
  }

  // 4. Token-by-token replacement fallback
  const tokens = englishText.split(/(\s+|[.,!?;:()])/);
  let translated = tokens
    .map((token) => {
      const lower = token.toLowerCase();
      if (VOCABULARY_MAP[lower]) {
        return VOCABULARY_MAP[lower].hi;
      }
      return token;
    })
    .join('');

  return translated;
}

/**
 * Translate Hindi text to English using the NTREX parallel corpus & vocabulary map.
 */
export function translateHindiToEnglish(hindiText: string): string {
  const query = hindiText.trim();
  if (!query) return '';

  // 1. Check direct vocabulary
  for (const key of Object.keys(VOCABULARY_MAP)) {
    if (VOCABULARY_MAP[key].hi === query) {
      return VOCABULARY_MAP[key].en;
    }
  }

  // 2. Exact match in NTREX benchmark
  const exact = pairs.find((p) => p.sourceText.trim() === query);
  if (exact) {
    return exact.targetText;
  }

  // 3. Substring match in NTREX benchmark
  const found = pairs.find((p) => p.sourceText.includes(query));
  if (found) {
    return found.targetText;
  }

  // 4. Token-by-token replacement fallback
  const tokens = hindiText.split(/(\s+|[.,!?;:()।])/);
  let translated = tokens
    .map((token) => {
      for (const key of Object.keys(VOCABULARY_MAP)) {
        if (VOCABULARY_MAP[key].hi === token) {
          return VOCABULARY_MAP[key].en;
        }
      }
      return token;
    })
    .join('');

  return translated;
}

/**
 * Translate query or response according to the student's selected language.
 * If target is 'en' and input is Hindi, translates to English.
 * If target is 'hi' and input is English, translates to Hindi.
 */
export function translateAccordingToLanguage(
  text: string,
  targetLanguage: 'en' | 'hi' | 'bilingual'
): string {
  if (targetLanguage === 'en') {
    if (isHindiText(text)) {
      return translateHindiToEnglish(text);
    }
    return text;
  } else if (targetLanguage === 'hi') {
    if (!isHindiText(text)) {
      return translateEnglishToHindi(text);
    }
    return text;
  }
  return text;
}

/**
 * Search the NTREX dataset for parallel example pairs matching a keyword.
 */
export function searchTranslationCorpus(
  keyword: string,
  limit: number = 5
): TranslationPair[] {
  const k = keyword.trim().toLowerCase();
  if (!k) return [];

  const results: TranslationPair[] = [];
  for (const pair of pairs) {
    if (
      pair.targetText.toLowerCase().includes(k) ||
      pair.sourceText.includes(keyword)
    ) {
      results.push(pair);
      if (results.length >= limit) break;
    }
  }
  return results;
}
