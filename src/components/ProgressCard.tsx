import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SubjectProgress } from '../types/progress';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface ProgressCardProps {
  progress: SubjectProgress;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ progress }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{progress.subjectName}</Text>
        <Text style={styles.percentText}>{progress.completedPercentage}%</Text>
      </View>

      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${progress.completedPercentage}%` },
          ]}
        />
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          {progress.chaptersCompleted}/{progress.totalChapters} Chapters • {progress.questionsAttempted} Questions Solved
        </Text>
        <Text style={styles.quizAvgText}>
          Quiz Avg: {progress.quizAverage}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.white,
    padding: spacing.base,
    borderRadius: spacing.radiusBase,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h4,
    color: palette.gray900,
  },
  percentText: {
    ...typography.h4,
    color: palette.primary,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: palette.gray200,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: palette.primary,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  metaText: {
    ...typography.caption,
    color: palette.gray500,
  },
  quizAvgText: {
    ...typography.caption,
    color: palette.secondary,
    fontWeight: '700',
  },
});
