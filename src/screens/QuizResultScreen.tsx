import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { OfflineBanner } from '../components/OfflineBanner';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { Quiz, QuizResult } from '../types/quiz';

interface QuizResultScreenProps {
  navigation: any;
  route: any;
}

export const QuizResultScreen: React.FC<QuizResultScreenProps> = ({
  navigation,
  route,
}) => {
  const result: QuizResult = route.params?.result;
  const quiz: Quiz = route.params?.quiz;
  const [showReview, setShowReview] = useState(false);

  if (!result || !quiz) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No quiz result available.</Text>
        <PrimaryButton
          title="Go to Modules"
          onPress={() => navigation.navigate('Modules')}
          style={styles.backBtn}
        />
      </View>
    );
  }

  const isPassing = result.scorePercentage >= 60;

  const handleAskTutorAboutMistakes = () => {
    const wrongQuestions = quiz.questions.filter(
      (q) => result.userAnswers[q.id] !== q.correctOptionId
    );
    const initialPrompt = wrongQuestions.length > 0
      ? `Can you explain why the answer to "${wrongQuestions[0].question}" is option ${wrongQuestions[0].correctOptionId}?`
      : 'Can you summarize the key concepts of Quadratic Equations?';

    navigation.navigate('Tutor', { initialPrompt });
  };

  const handlePracticeWeakTopics = () => {
    const weakTopic = result.weakTopics[0] || 'Quadratic Equations';
    navigation.navigate('Practice', { topic: weakTopic });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <OfflineBanner text="Assessment Recorded On-Device" />

      {/* Main Score Card */}
      <View style={styles.scoreCard}>
        <View
          style={[
            styles.badgeCircle,
            isPassing ? styles.badgeSuccess : styles.badgeWarning,
          ]}
        >
          <Text style={styles.percentageText}>{result.scorePercentage}%</Text>
        </View>

        <Text style={styles.headline}>
          {isPassing ? 'Outstanding Performance!' : 'Good Effort, Keep Practicing!'}
        </Text>
        <Text style={styles.subheadline}>
          You answered {result.correctAnswersCount} of {result.totalQuestions} questions correctly.
        </Text>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Total Questions</Text>
            <Text style={styles.statValue}>{result.totalQuestions}</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Correct</Text>
            <Text style={[styles.statValue, { color: palette.secondary }]}>
              {result.correctAnswersCount}
            </Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Incorrect</Text>
            <Text style={[styles.statValue, { color: palette.danger }]}>
              {result.totalQuestions - result.correctAnswersCount}
            </Text>
          </View>
        </View>
      </View>

      {/* Topic Mastery Analysis */}
      <View style={styles.topicsSection}>
        <Text style={styles.sectionTitle}>Topic Mastery Breakdown</Text>

        {result.strongTopics.length > 0 && (
          <View style={styles.topicGroup}>
            <Text style={styles.groupLabel}>✓ Strong Concepts:</Text>
            <View style={styles.chipsRow}>
              {result.strongTopics.map((topic, i) => (
                <View key={i} style={[styles.topicChip, styles.chipSuccess]}>
                  <Text style={styles.chipSuccessText}>{topic}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {result.weakTopics.length > 0 && (
          <View style={styles.topicGroup}>
            <Text style={styles.groupLabel}>⚠ Topics Needing Practice:</Text>
            <View style={styles.chipsRow}>
              {result.weakTopics.map((topic, i) => (
                <View key={i} style={[styles.topicChip, styles.chipWarning]}>
                  <Text style={styles.chipWarningText}>{topic}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Review Answers Toggle */}
      <TouchableOpacity
        style={styles.reviewToggleBtn}
        onPress={() => setShowReview(!showReview)}
        activeOpacity={0.8}
      >
        <Text style={styles.reviewToggleText}>
          {showReview ? '▼ Hide Detailed Review' : '▶ Review Questions & Explanations'}
        </Text>
      </TouchableOpacity>

      {/* Question Details List */}
      {showReview && (
        <View style={styles.reviewList}>
          {quiz.questions.map((q, idx) => {
            const userAnswer = result.userAnswers[q.id];
            const isRight = userAnswer === q.correctOptionId;
            return (
              <View
                key={q.id}
                style={[
                  styles.reviewCard,
                  isRight ? styles.cardCorrectBorder : styles.cardWrongBorder,
                ]}
              >
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewQIndex}>Q{idx + 1}. {q.topic}</Text>
                  <Text
                    style={[
                      styles.reviewStatusBadge,
                      isRight ? styles.badgeGreen : styles.badgeRed,
                    ]}
                  >
                    {isRight ? 'Correct' : 'Incorrect'}
                  </Text>
                </View>

                <Text style={styles.reviewQuestionText}>{q.question}</Text>

                <View style={styles.reviewAnswerRow}>
                  <Text style={styles.answerLabel}>Your answer: </Text>
                  <Text
                    style={[
                      styles.answerValue,
                      isRight ? styles.answerCorrect : styles.answerWrong,
                    ]}
                  >
                    {userAnswer ? `Option ${userAnswer}` : 'Not answered'}
                  </Text>
                </View>

                {!isRight && (
                  <View style={styles.reviewAnswerRow}>
                    <Text style={styles.answerLabel}>Correct answer: </Text>
                    <Text style={[styles.answerValue, styles.answerCorrect]}>
                      Option {q.correctOptionId}
                    </Text>
                  </View>
                )}

                <View style={styles.explanationBox}>
                  <Text style={styles.explanationTitle}>Explanation:</Text>
                  <Text style={styles.explanationBody}>{q.explanation}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        {result.weakTopics.length > 0 && (
          <PrimaryButton
            title="Ask AI Tutor About Mistakes 🤖"
            onPress={handleAskTutorAboutMistakes}
            style={styles.btnSpacing}
          />
        )}

        <SecondaryButton
          title="Practice Weak Topics"
          onPress={handlePracticeWeakTopics}
          style={styles.btnSpacing}
        />

        <SecondaryButton
          title="Return to Modules"
          onPress={() => navigation.navigate('Modules')}
          style={styles.btnSpacing}
        />
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.base,
  },
  emptyText: {
    ...typography.body,
    color: palette.gray600,
    marginBottom: spacing.md,
  },
  backBtn: {
    width: '100%',
  },
  scoreCard: {
    backgroundColor: palette.white,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.gray200,
    marginVertical: spacing.md,
  },
  badgeCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  badgeSuccess: {
    backgroundColor: palette.secondarySurface,
    borderWidth: 3,
    borderColor: palette.secondary,
  },
  badgeWarning: {
    backgroundColor: palette.warningSurface,
    borderWidth: 3,
    borderColor: palette.warning,
  },
  percentageText: {
    fontSize: 26,
    fontWeight: '900',
    color: palette.gray900,
  },
  headline: {
    ...typography.h2,
    color: palette.gray900,
    textAlign: 'center',
    marginBottom: 4,
  },
  subheadline: {
    ...typography.bodySecondary,
    textAlign: 'center',
    color: palette.gray600,
  },
  divider: {
    height: 1,
    backgroundColor: palette.gray200,
    width: '100%',
    marginVertical: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statCol: {
    alignItems: 'center',
  },
  statLabel: {
    ...typography.caption,
    color: palette.gray500,
    marginBottom: 2,
  },
  statValue: {
    ...typography.h3,
    color: palette.gray900,
  },
  topicsSection: {
    backgroundColor: palette.white,
    padding: spacing.base,
    borderRadius: spacing.radiusBase,
    borderWidth: 1,
    borderColor: palette.gray200,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: palette.gray900,
    marginBottom: spacing.sm,
  },
  topicGroup: {
    marginTop: spacing.xs,
  },
  groupLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: palette.gray600,
    marginBottom: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  topicChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: spacing.radiusPill,
  },
  chipSuccess: {
    backgroundColor: palette.secondarySurface,
    borderWidth: 1,
    borderColor: palette.secondaryLight,
  },
  chipSuccessText: {
    ...typography.caption,
    fontWeight: '700',
    color: palette.secondaryDark,
  },
  chipWarning: {
    backgroundColor: palette.dangerSurface,
    borderWidth: 1,
    borderColor: palette.dangerLight,
  },
  chipWarningText: {
    ...typography.caption,
    fontWeight: '700',
    color: palette.danger,
  },
  reviewToggleBtn: {
    backgroundColor: palette.white,
    padding: spacing.md,
    borderRadius: spacing.radiusBase,
    borderWidth: 1,
    borderColor: palette.gray200,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  reviewToggleText: {
    ...typography.button,
    color: palette.primary,
    fontSize: 14,
  },
  reviewList: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  reviewCard: {
    backgroundColor: palette.white,
    padding: spacing.md,
    borderRadius: spacing.radiusBase,
    borderWidth: 1,
  },
  cardCorrectBorder: {
    borderColor: palette.secondaryLight,
  },
  cardWrongBorder: {
    borderColor: palette.dangerLight,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  reviewQIndex: {
    ...typography.caption,
    fontWeight: '800',
    color: palette.gray700,
  },
  reviewStatusBadge: {
    ...typography.caption,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeGreen: {
    backgroundColor: palette.secondarySurface,
    color: palette.secondaryDark,
  },
  badgeRed: {
    backgroundColor: palette.dangerSurface,
    color: palette.danger,
  },
  reviewQuestionText: {
    ...typography.body,
    fontWeight: '600',
    color: palette.gray900,
    marginBottom: spacing.sm,
  },
  reviewAnswerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  answerLabel: {
    ...typography.caption,
    color: palette.gray600,
  },
  answerValue: {
    ...typography.caption,
    fontWeight: '700',
  },
  answerCorrect: {
    color: palette.secondaryDark,
  },
  answerWrong: {
    color: palette.danger,
  },
  explanationBox: {
    backgroundColor: palette.gray50,
    padding: spacing.sm,
    borderRadius: spacing.radiusSm,
    marginTop: spacing.xs,
  },
  explanationTitle: {
    ...typography.caption,
    fontWeight: '800',
    color: palette.gray700,
    marginBottom: 2,
  },
  explanationBody: {
    ...typography.caption,
    color: palette.gray700,
    lineHeight: 18,
  },
  actionSection: {
    marginTop: spacing.sm,
  },
  btnSpacing: {
    marginBottom: spacing.sm,
  },
});
