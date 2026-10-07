import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { QuizOption } from '../components/QuizOption';
import { PrimaryButton } from '../components/PrimaryButton';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { mockPracticeQuestions } from '../data/mockQuestions';
import { useProgressStore } from '../store/progressStore';
import { useProfileStore } from '../store/profileStore';

interface PracticeScreenProps {
  navigation: any;
  route: any;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  navigation,
  route,
}) => {
  const topic = route.params?.topic || 'Quadratic Equations (द्विघात समीकरण)';
  const { recordQuestionAttempt } = useProgressStore();
  const { profile } = useProfileStore();

  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'hard'>('all');
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Filter questions by difficulty and student profile
  const filteredQuestions = mockPracticeQuestions.filter((q) => {
    if (difficultyFilter === 'all') return true;
    return q.difficulty === difficultyFilter;
  });

  const currentQ = filteredQuestions[questionIdx] || filteredQuestions[0];
  const isCorrect = selectedOptionId === currentQ.correctOptionId;

  const handleSelectOption = (optId: string) => {
    if (!isSubmitted) {
      setSelectedOptionId(optId);
    }
  };

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    setIsSubmitted(true);
    recordQuestionAttempt('class10_math', isCorrect);
  };

  const handleNext = () => {
    if (questionIdx < filteredQuestions.length - 1) {
      setQuestionIdx(questionIdx + 1);
      setSelectedOptionId(null);
      setIsSubmitted(false);
    } else {
      navigation.goBack();
    }
  };

  const handleFilterChange = (filter: 'easy' | 'hard') => {
    setDifficultyFilter(filter);
    setQuestionIdx(0);
    setSelectedOptionId(null);
    setIsSubmitted(false);
  };

  const isHindi = profile.language === 'hi' || profile.language === 'bilingual';
  const displayQuestion =
    isHindi && currentQ.questionHindi ? currentQ.questionHindi : currentQ.question;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Header Card */}
      <View style={styles.topCard}>
        <View style={styles.headerRow}>
          <Text style={styles.screenLabel}>⚡ OFFLINE PRACTICE</Text>
          <Text style={styles.qCounter}>
            Question {questionIdx + 1} of {filteredQuestions.length}
          </Text>
        </View>

        <Text style={styles.topicTitle}>{topic}</Text>
        <Text style={styles.curriculumSub}>
          Class {profile.classLevel} • {profile.board.toUpperCase()} Syllabus Locked
        </Text>

        {/* Difficulty Controls (Requirement 18: "Give me an easy question" / "Give me a harder question") */}
        <View style={styles.difficultyRow}>
          <TouchableOpacity
            style={[
              styles.diffBtn,
              difficultyFilter === 'easy' && styles.diffBtnActiveEasy,
            ]}
            onPress={() => handleFilterChange('easy')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.diffBtnText,
                difficultyFilter === 'easy' && styles.diffBtnTextActive,
              ]}
            >
              🌱 Give me an easy question
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.diffBtn,
              difficultyFilter === 'hard' && styles.diffBtnActiveHard,
            ]}
            onPress={() => handleFilterChange('hard')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.diffBtnText,
                difficultyFilter === 'hard' && styles.diffBtnTextActive,
              ]}
            >
              🔥 Give me a harder question
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Question Card */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{displayQuestion}</Text>

        <View style={styles.optionsList}>
          {currentQ.options.map((opt) => (
            <QuizOption
              key={opt.id}
              option={opt}
              isSelected={selectedOptionId === opt.id}
              disabled={isSubmitted}
              isCorrect={isSubmitted ? opt.id === currentQ.correctOptionId : null}
              onSelect={() => handleSelectOption(opt.id)}
            />
          ))}
        </View>

        {!isSubmitted ? (
          <PrimaryButton
            title="Check Answer"
            onPress={handleSubmit}
            disabled={!selectedOptionId}
            style={styles.submitBtn}
          />
        ) : (
          <View style={styles.solutionSection}>
            <View
              style={[
                styles.resultBanner,
                isCorrect ? styles.resultCorrect : styles.resultIncorrect,
              ]}
            >
              <Text style={styles.resultText}>
                {isCorrect ? '✓ Correct! शाबाश!' : '✗ Not quite. Re-evaluating...'}
              </Text>
            </View>

            <Text style={styles.solutionHeader}>Step-by-Step Solution:</Text>
            {currentQ.stepByStepSolution.map((step, idx) => (
              <Text key={idx} style={styles.stepText}>
                • {step}
              </Text>
            ))}

            <Text style={styles.finalAnswerText}>
              Final Answer: {currentQ.finalAnswer}
            </Text>

            <PrimaryButton
              title={
                questionIdx < filteredQuestions.length - 1
                  ? 'Next Question ➔'
                  : 'Complete Practice 🎯'
              }
              onPress={handleNext}
              style={styles.nextBtn}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.base,
    backgroundColor: palette.gray50,
    paddingBottom: spacing.xxl,
  },
  topCard: {
    backgroundColor: palette.white,
    padding: spacing.base,
    borderRadius: spacing.radiusBase,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  screenLabel: {
    ...typography.caption,
    color: palette.primary,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  qCounter: {
    ...typography.caption,
    color: palette.gray500,
    fontWeight: '700',
  },
  topicTitle: {
    ...typography.h2,
    color: palette.gray900,
  },
  curriculumSub: {
    ...typography.caption,
    color: palette.gray500,
    marginTop: 2,
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  diffBtn: {
    flex: 1,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.radiusSm,
    backgroundColor: palette.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  diffBtnActiveEasy: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
  },
  diffBtnActiveHard: {
    backgroundColor: '#FEF3C7',
    borderColor: '#D97706',
  },
  diffBtnText: {
    ...typography.caption,
    fontWeight: '700',
    fontSize: 11,
    color: palette.gray700,
  },
  diffBtnTextActive: {
    color: palette.gray900,
  },
  questionCard: {
    backgroundColor: palette.white,
    padding: spacing.base,
    borderRadius: spacing.radiusBase,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  questionText: {
    ...typography.bodyLarge,
    fontWeight: '700',
    color: palette.gray900,
    lineHeight: 24,
    marginBottom: spacing.base,
  },
  optionsList: {
    marginBottom: spacing.base,
  },
  submitBtn: {
    marginTop: spacing.xs,
  },
  solutionSection: {
    marginTop: spacing.md,
    paddingTop: spacing.base,
    borderTopWidth: 1,
    borderTopColor: palette.gray200,
  },
  resultBanner: {
    padding: spacing.sm,
    borderRadius: spacing.radiusSm,
    marginBottom: spacing.base,
    alignItems: 'center',
  },
  resultCorrect: {
    backgroundColor: '#DCFCE7',
  },
  resultIncorrect: {
    backgroundColor: '#FEE2E2',
  },
  resultText: {
    fontWeight: '800',
    fontSize: 14,
    color: palette.gray900,
  },
  solutionHeader: {
    ...typography.body,
    fontWeight: '800',
    color: palette.gray900,
    marginBottom: spacing.xs,
  },
  stepText: {
    ...typography.bodySmall,
    color: palette.gray700,
    lineHeight: 20,
    marginBottom: 4,
  },
  finalAnswerText: {
    ...typography.body,
    fontWeight: '800',
    color: palette.primary,
    marginTop: spacing.sm,
    marginBottom: spacing.base,
  },
  nextBtn: {
    marginTop: spacing.xs,
  },
});
