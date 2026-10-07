import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { QuizOption } from '../components/QuizOption';
import { PrimaryButton } from '../components/PrimaryButton';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { mockPracticeQuestions } from '../data/mockQuestions';
import { useProgressStore } from '../store/progressStore';

interface PracticeScreenProps {
  navigation: any;
  route: any;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  navigation,
  route,
}) => {
  const topic = route.params?.topic || 'Linear & Quadratic Equations';
  const { recordQuestionAttempt } = useProgressStore();

  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQ = mockPracticeQuestions[questionIdx] || mockPracticeQuestions[0];
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
    if (questionIdx < mockPracticeQuestions.length - 1) {
      setQuestionIdx(questionIdx + 1);
      setSelectedOptionId(null);
      setIsSubmitted(false);
    } else {
      navigation.goBack();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topCard}>
        <View style={styles.headerRow}>
          <Text style={styles.screenLabel}>PRACTICE MODE</Text>
          <Text style={styles.qCounter}>
            Question {questionIdx + 1} of {mockPracticeQuestions.length}
          </Text>
        </View>

        <Text style={styles.topicTitle}>{topic}</Text>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{currentQ.question}</Text>

        <View style={styles.optionsList}>
          {currentQ.options.map((opt) => (
            <QuizOption
              key={opt.id}
              option={opt}
              isSelected={selectedOptionId === opt.id}
              isCorrect={isSubmitted ? opt.id === currentQ.correctOptionId : null}
              disabled={isSubmitted}
              onSelect={handleSelectOption}
            />
          ))}
        </View>

        {!isSubmitted ? (
          <PrimaryButton
            title="Check Answer"
            onPress={handleSubmit}
            disabled={!selectedOptionId}
            style={styles.actionBtn}
          />
        ) : (
          <View style={styles.solutionBox}>
            <View
              style={[
                styles.feedbackHeader,
                isCorrect ? styles.feedbackHeaderCorrect : styles.feedbackHeaderIncorrect,
              ]}
            >
              <Text
                style={[
                  styles.feedbackTitle,
                  isCorrect ? styles.feedbackTitleCorrect : styles.feedbackTitleIncorrect,
                ]}
              >
                {isCorrect ? '✓ Correct Answer!' : '✗ Not quite right'}
              </Text>
            </View>

            <View style={styles.stepsContainer}>
              <Text style={styles.stepsHeadline}>Step-by-Step Solution:</Text>
              {currentQ.stepByStepSolution.map((s, i) => (
                <Text key={i} style={styles.stepLine}>
                  {s}
                </Text>
              ))}
              <Text style={styles.finalAnswerText}>
                Final Answer: {currentQ.finalAnswer}
              </Text>
            </View>

            <PrimaryButton
              title={
                questionIdx < mockPracticeQuestions.length - 1
                  ? 'Continue ➔'
                  : 'Complete Practice ✓'
              }
              onPress={handleNext}
              style={styles.actionBtn}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: palette.gray50,
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  topCard: {
    backgroundColor: palette.white,
    padding: spacing.base,
    borderRadius: spacing.radiusBase,
    borderWidth: 1,
    borderColor: palette.gray200,
    marginBottom: spacing.md,
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
    letterSpacing: 0.8,
  },
  qCounter: {
    ...typography.caption,
    color: palette.gray500,
    fontWeight: '700',
  },
  topicTitle: {
    ...typography.h3,
    color: palette.gray900,
  },
  questionCard: {
    backgroundColor: palette.white,
    padding: spacing.lg,
    borderRadius: spacing.radiusBase,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  questionText: {
    ...typography.h3,
    color: palette.gray900,
    lineHeight: 26,
    marginBottom: spacing.lg,
  },
  optionsList: {
    marginBottom: spacing.lg,
  },
  actionBtn: {
    marginTop: spacing.sm,
  },
  solutionBox: {
    marginTop: spacing.md,
    backgroundColor: palette.gray50,
    borderRadius: spacing.radiusMd,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  feedbackHeader: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  feedbackHeaderCorrect: {
    backgroundColor: palette.secondarySurface,
  },
  feedbackHeaderIncorrect: {
    backgroundColor: palette.dangerSurface,
  },
  feedbackTitle: {
    ...typography.button,
    fontSize: 14,
  },
  feedbackTitleCorrect: {
    color: palette.secondary,
  },
  feedbackTitleIncorrect: {
    color: palette.danger,
  },
  stepsContainer: {
    padding: spacing.md,
  },
  stepsHeadline: {
    ...typography.caption,
    fontWeight: '800',
    color: palette.gray700,
    marginBottom: spacing.xs,
  },
  stepLine: {
    ...typography.body,
    color: palette.gray800,
    marginVertical: 2,
    lineHeight: 20,
  },
  finalAnswerText: {
    ...typography.h4,
    color: palette.primary,
    marginTop: spacing.sm,
  },
});
