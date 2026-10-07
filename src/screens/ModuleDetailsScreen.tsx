import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ChapterItem } from '../components/ChapterItem';
import { PrimaryButton } from '../components/PrimaryButton';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { useModuleStore } from '../store/moduleStore';
import { Chapter } from '../types/module';

interface ModuleDetailsScreenProps {
  navigation: any;
  route: any;
}

export const ModuleDetailsScreen: React.FC<ModuleDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const moduleId = route.params?.moduleId || 'class10_math';
  const { modules } = useModuleStore();
  const currentModule = modules.find((m) => m.id === moduleId) || modules[0];

  const handleSelectChapter = (ch: Chapter) => {
    navigation.navigate('Reader', {
      moduleId: currentModule.id,
      chapterId: ch.id,
    });
  };

  const handleStartLearning = () => {
    const firstOrCurrent =
      currentModule.chapters.find((c) => c.status === 'current') ||
      currentModule.chapters[0];
    if (firstOrCurrent) {
      handleSelectChapter(firstOrCurrent);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>NCERT-ALIGNED CURRICULUM</Text>
        </View>

        <Text style={styles.title}>{currentModule.title}</Text>
        <Text style={styles.meta}>
          Class {currentModule.classNumber} • {currentModule.totalChapters} Chapters • ~{currentModule.sizeMB} MB
        </Text>

        <Text style={styles.description}>{currentModule.description}</Text>

        <PrimaryButton
          title="Start Learning ➔"
          onPress={handleStartLearning}
          style={styles.startBtn}
        />
      </View>

      <View style={styles.chapterSection}>
        <Text style={styles.sectionTitle}>Chapters ({currentModule.chapters.length})</Text>
        <Text style={styles.sectionSubtitle}>
          Tap any chapter to read content and ask Guru questions
        </Text>

        {currentModule.chapters.map((ch) => (
          <ChapterItem
            key={ch.id}
            chapter={ch}
            onPress={handleSelectChapter}
          />
        ))}
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
  headerCard: {
    backgroundColor: palette.white,
    padding: spacing.lg,
    borderRadius: spacing.radiusBase,
    borderWidth: 1,
    borderColor: palette.gray200,
    marginBottom: spacing.base,
  },
  badge: {
    backgroundColor: palette.primarySurface,
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  badgeText: {
    ...typography.caption,
    color: palette.primary,
    fontWeight: '800',
  },
  title: {
    ...typography.h2,
    color: palette.gray900,
  },
  meta: {
    ...typography.caption,
    color: palette.gray500,
    marginTop: 4,
  },
  description: {
    ...typography.body,
    color: palette.gray600,
    marginVertical: spacing.md,
    lineHeight: 22,
  },
  startBtn: {
    marginTop: spacing.xs,
  },
  chapterSection: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: palette.gray900,
  },
  sectionSubtitle: {
    ...typography.caption,
    color: palette.gray500,
    marginBottom: spacing.md,
    marginTop: 2,
  },
});
