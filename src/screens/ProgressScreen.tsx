import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useProgressStore } from '../store/progressStore';
import { useProfileStore } from '../store/profileStore';
import { ProgressCard } from '../components/ProgressCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { OfflineBanner } from '../components/OfflineBanner';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface ProgressScreenProps {
  navigation: any;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ navigation }) => {
  const { progress } = useProgressStore();
  const { profile } = useProfileStore();

  const subjectsList = Object.values(progress.subjects);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <OfflineBanner text="Progress Saved On-Device" />

      {/* Overview Header */}
      <View style={styles.header}>
        <Text style={styles.studentGreeting}>{profile.name}'s Learning Journey</Text>
        <Text style={styles.headerSubtitle}>
          Consistent practice leads to real conceptual mastery.
        </Text>
      </View>

      {/* Key Metric Highlights */}
      <View style={styles.metricGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricIcon}>🔥</Text>
          <Text style={styles.metricValue}>{progress.currentStreakDays} Days</Text>
          <Text style={styles.metricLabel}>Daily Streak</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricIcon}>🎯</Text>
          <Text style={styles.metricValue}>{progress.totalQuestionsSolved}</Text>
          <Text style={styles.metricLabel}>Questions Solved</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricIcon}>⭐</Text>
          <Text style={styles.metricValue}>{progress.overallAccuracyPercent}%</Text>
          <Text style={styles.metricLabel}>Overall Accuracy</Text>
        </View>
      </View>

      {/* Curriculum Mastery Breakdown */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Curriculum Mastery</Text>
        <Text style={styles.sectionBadge}>
          Class {profile.classNumber} • Offline
        </Text>
      </View>

      {subjectsList.map((subj) => (
        <ProgressCard key={subj.moduleId} progress={subj} />
      ))}

      {/* Offline Storage Notice Box */}
      <View style={styles.offlineNoticeBox}>
        <View style={styles.offlineNoticeHeader}>
          <Text style={styles.offlineNoticeIcon}>🔒</Text>
          <Text style={styles.offlineNoticeTitle}>100% On-Device Records</Text>
        </View>
        <Text style={styles.offlineNoticeText}>
          Your answers, streak counts, and scores are stored inside your device's local database. No internet or external server is required to maintain your progress.
        </Text>
      </View>

      {/* Quick Study Actions */}
      <View style={styles.actionsBox}>
        <PrimaryButton
          title="Take a Quick Quiz 📝"
          onPress={() => navigation.navigate('Quiz', { quizId: 'quiz_math10_ch04' })}
          style={styles.actionBtn}
        />
        <SecondaryButton
          title="Solve Practice Questions 💡"
          onPress={() => navigation.navigate('Practice', { topic: 'Quadratic Equations' })}
          style={styles.actionBtn}
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
  header: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  studentGreeting: {
    ...typography.h2,
    color: palette.gray900,
  },
  headerSubtitle: {
    ...typography.bodySecondary,
    color: palette.gray600,
    marginTop: 2,
  },
  metricGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  metricCard: {
    flex: 1,
    backgroundColor: palette.white,
    padding: spacing.md,
    borderRadius: spacing.radiusBase,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  metricIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  metricValue: {
    ...typography.h4,
    color: palette.gray900,
    fontWeight: '800',
  },
  metricLabel: {
    ...typography.caption,
    fontSize: 11,
    color: palette.gray500,
    marginTop: 2,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: palette.gray900,
  },
  sectionBadge: {
    ...typography.caption,
    fontWeight: '700',
    color: palette.primary,
    backgroundColor: palette.primarySurface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: spacing.radiusSm,
  },
  offlineNoticeBox: {
    backgroundColor: palette.white,
    borderRadius: spacing.radiusBase,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.gray200,
    marginVertical: spacing.md,
  },
  offlineNoticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  offlineNoticeIcon: {
    fontSize: 16,
  },
  offlineNoticeTitle: {
    ...typography.caption,
    fontWeight: '800',
    color: palette.gray800,
  },
  offlineNoticeText: {
    ...typography.caption,
    color: palette.gray600,
    lineHeight: 18,
  },
  actionsBox: {
    marginTop: spacing.xs,
  },
  actionBtn: {
    marginBottom: spacing.sm,
  },
});
