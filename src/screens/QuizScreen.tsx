import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { QuizOption } from '../components/QuizOption';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { OfflineBanner } from '../components/OfflineBanner';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { mockQuizzes } from '../data/mockQuizzes';
import { useProgressStore } from '../store/progressStore';
import { QuizResult } from '../types/quiz';

interface QuizScreenProps {
  navigation: any;
  route: any;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ navigation, route }) => {
  const quizId = route.params?.quizId || 'quiz_math10_ch04';
  const quiz = mockQuizzes.find((q) => q.id === quizId) || mockQuizzes[0];
  const { recordQuizScore } = useProgressStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimitSeconds);
  const [isFinished, setIsFinished] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFinished]);

  const currentQ = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const currentSelection = selectedAnswers[currentQ.id];

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  const calculateResult = (): QuizResult => {
    let correct = 0;
    const strongTopics: string[] = [];
    const weakTopics: string[] = [];

    quiz.questions.forEach((q) => {
      const isRight = selectedAnswers[q.id] === q.correctOptionId;
      if (isRight) {
        correct += 1;
        if (!strongTopics.includes(q.topic)) strongTopics.push(q.topic);
      } else {
        if (!weakTopics.includes(q.topic)) weakTopics.push(q.topic);
      }
    });

    const scorePct = Math.round((correct / totalQuestions) * 100);
    recordQuizScore(quiz.moduleId, scorePct);

    return {
      quizId: quiz.id,
      quizTitle: quiz.title,
      totalQuestions,
      correctAnswersCount: correct,
      scorePercentage: scorePct,
      strongTopics,
      weakTopics,
      completedAt: new Date().toISOString(),
      userAnswers: selectedAnswers,
    };
  };

  const handleTimeUp = () => {
    setIsFinished(true);
    Alert.alert('Time is up!', 'Your quiz has ended. Viewing your scorecard now.', [
      {
        text: 'View Results',
        onPress: () => {
          const result = calculateResult();
          navigation.replace('QuizResult', { result, quiz });
        },
      },
    ]);
  };

  const handleSubmitQuiz = () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < totalQuestions) {
      Alert.alert(
        'Unanswered Questions',
        `You have answered ${answeredCount} of ${totalQuestions} questions. Are you sure you want to finish now?`,
        [
          { text: 'Continue Quiz', style: 'cancel' },
          {
            text: 'Finish Now',
            onPress: () => {
              setIsFinished(true);
              const result = calculateResult();
              navigation.replace('QuizResult', { result, quiz });
            },
          },
        ]
      );
    } else {
      setIsFinished(true);
      const result = calculateResult();
      navigation.replace('QuizResult', { result, quiz });
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.screen}>
      <OfflineBanner text="Offline Quiz Mode Active" />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.timerBadge}>
          <Text style={styles.timerLabel}>⏱ {formatTimer(timeLeft)}</Text>
        </View>
        <Text style={styles.progressCounter}>
          {currentIndex + 1} / {totalQuestions}
        </Text>
      </View>

      {/* Progress Line */}
      <View style={styles.progressBarTrack}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${((currentIndex + 1) / totalQuestions) * 100}%` },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Topic Tag */}
        <View style={styles.topicBadge}>
          <Text style={styles.topicText}>{currentQ.topic}</Text>
        </View>

        {/* Question text */}
        <Text style={styles.questionText}>{currentQ.question}</Text>

        {/* Options */}
        <View style={styles.optionsList}>
          {currentQ.options.map((opt) => (
            <QuizOption
              key={opt.id}
              option={opt}
              isSelected={currentSelection === opt.id}
              isCorrect={null}
              onSelect={handleSelectOption}
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Action Footer */}
      <View style={styles.footer}>
        <View style={styles.navRow}>
          {currentIndex > 0 ? (
            <SecondaryButton
              title="‹ Previous"
              onPress={handlePrevious}
              style={styles.navBtn}
            />
          ) : (
            <View style={styles.navSpacer} />
          )}

          <PrimaryButton
            title={currentIndex === totalQuestions - 1 ? 'Finish Quiz ✓' : 'Next Question ›'}
            onPress={handleNext}
            style={styles.navBtn}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.gray50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    backgroundColor: palette.white,
  },
  timerBadge: {
    backgroundColor: palette.primarySurface,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: spacing.radiusPill,
    borderWidth: 1,
    borderColor: palette.primaryLight,
  },
  timerLabel: {
    ...typography.caption,
    fontWeight: '800',
    color: palette.primaryDark,
  },
  progressCounter: {
    ...typography.caption,
    fontWeight: '800',
    color: palette.gray600,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: palette.gray200,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: palette.primary,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  topicBadge: {
    alignSelf: 'flex-start',
    backgroundColor: palette.gray200,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: spacing.radiusSm,
    marginBottom: spacing.sm,
  },
  topicText: {
    ...typography.caption,
    fontWeight: '700',
    color: palette.gray700,
  },
  questionText: {
    ...typography.h3,
    color: palette.gray900,
    lineHeight: 28,
    marginBottom: spacing.lg,
  },
  optionsList: {
    gap: spacing.xs,
  },
  footer: {
    backgroundColor: palette.white,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: palette.gray200,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  navBtn: {
    flex: 1,
  },
  navSpacer: {
    flex: 1,
  },
});
