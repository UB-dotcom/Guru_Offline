import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { OfflineBanner } from '../components/OfflineBanner';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { useModuleStore } from '../store/moduleStore';
import { useTutorStore } from '../store/tutorStore';
import { useProfileStore } from '../store/profileStore';
import { filterModulesForProfile } from '../services/curriculumCatalog';

interface ReaderScreenProps {
  navigation: any;
  route: any;
}

export const ReaderScreen: React.FC<ReaderScreenProps> = ({
  navigation,
  route,
}) => {
  const moduleId = route.params?.moduleId || 'class10_math';
  const initialChapterId = route.params?.chapterId || 'ch04';
  const { modules } = useModuleStore();
  const { profile } = useProfileStore();
  const { setContext } = useTutorStore();

  const allAvailable = filterModulesForProfile(
    modules,
    profile.board,
    profile.state,
    profile.classLevel,
    profile.stream,
    [],
    profile.language
  );
  const currentModule =
    modules.find((m) => m.id === moduleId) ||
    allAvailable.find((m) => m.id === moduleId) ||
    modules[0];
  const [chapterIdx, setChapterIdx] = useState(
    Math.max(
      0,
      currentModule.chapters.findIndex((c) => c.id === initialChapterId)
    )
  );

  const chapter = currentModule.chapters[chapterIdx] || currentModule.chapters[0];

  const handleAskGuru = () => {
    setContext(`${currentModule.title} — Chapter ${chapter.chapterNumber}: ${chapter.title}`);
    navigation.navigate('TutorTab');
  };

  const handlePrevious = () => {
    if (chapterIdx > 0) {
      setChapterIdx(chapterIdx - 1);
    }
  };

  const handleNext = () => {
    if (chapterIdx < currentModule.chapters.length - 1) {
      setChapterIdx(chapterIdx + 1);
    }
  };

  return (
    <View style={styles.screen}>
      <OfflineBanner />

      {/* Reader Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Back to module"
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.titleCol}>
          <Text style={styles.chapterNum}>Chapter {chapter.chapterNumber}</Text>
          <Text style={styles.chapterTitle} numberOfLines={1}>
            {chapter.title}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.practiceBtn}
          onPress={() => navigation.navigate('Practice', { topic: chapter.title })}
          accessibilityRole="button"
          accessibilityLabel="Practice this chapter"
        >
          <Text style={styles.practiceBtnText}>✏️ Practice</Text>
        </TouchableOpacity>
      </View>

      {/* Reader Content Body */}
      <ScrollView contentContainerStyle={styles.contentBody}>
        <View style={styles.readingCard}>
          <Text style={styles.summaryHeadline}>Concept Summary</Text>
          <Text style={styles.summaryText}>{chapter.summary}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionHeadline}>Chapter Content & Explanation</Text>
          <Text style={styles.contentParagraph}>{chapter.content}</Text>

          {chapter.formulas && chapter.formulas.length > 0 && (
            <View style={styles.formulasBox}>
              <Text style={styles.formulasTitle}>🔑 Key Curriculum Formulas:</Text>
              {chapter.formulas.map((f, i) => (
                <Text key={i} style={styles.formulaItem}>
                  • {f}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.askPromptCard}>
            <Text style={styles.askPromptTitle}>Have a question about this chapter?</Text>
            <Text style={styles.askPromptDesc}>
              Guru's local AI can break it down or give you simpler examples.
            </Text>
            <TouchableOpacity style={styles.askInlineBtn} onPress={handleAskGuru}>
              <Text style={styles.askInlineText}>🤖 Ask Guru About This Chapter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pager Bar */}
        <View style={styles.pagerBar}>
          <TouchableOpacity
            style={[styles.pagerBtn, chapterIdx === 0 && styles.pagerBtnDisabled]}
            onPress={handlePrevious}
            disabled={chapterIdx === 0}
            accessibilityRole="button"
            accessibilityLabel="Previous chapter"
          >
            <Text style={[styles.pagerText, chapterIdx === 0 && styles.pagerTextDisabled]}>
              ← Previous
            </Text>
          </TouchableOpacity>

          <Text style={styles.pagerIndicator}>
            Chapter {chapter.chapterNumber} of {currentModule.chapters.length}
          </Text>

          <TouchableOpacity
            style={[
              styles.pagerBtn,
              chapterIdx === currentModule.chapters.length - 1 && styles.pagerBtnDisabled,
            ]}
            onPress={handleNext}
            disabled={chapterIdx === currentModule.chapters.length - 1}
            accessibilityRole="button"
            accessibilityLabel="Next chapter"
          >
            <Text
              style={[
                styles.pagerText,
                chapterIdx === currentModule.chapters.length - 1 && styles.pagerTextDisabled,
              ]}
            >
              Next →
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Ask Guru Button */}
      <TouchableOpacity
        style={styles.floatingAskBtn}
        onPress={handleAskGuru}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Ask Guru AI Tutor"
      >
        <Text style={styles.floatingAskIcon}>🤖</Text>
        <Text style={styles.floatingAskText}>Ask Guru</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.gray50,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.white,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: palette.gray200,
  },
  backBtn: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  backIcon: {
    fontSize: 22,
    color: palette.gray800,
  },
  titleCol: {
    flex: 1,
  },
  chapterNum: {
    ...typography.caption,
    color: palette.primary,
    fontWeight: '800',
  },
  chapterTitle: {
    ...typography.h4,
    color: palette.gray900,
  },
  practiceBtn: {
    backgroundColor: palette.primarySurface,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.radiusSm,
  },
  practiceBtnText: {
    ...typography.caption,
    color: palette.primary,
    fontWeight: '700',
  },
  contentBody: {
    padding: spacing.base,
    paddingBottom: 90, // Leave room for floating button
  },
  readingCard: {
    backgroundColor: palette.white,
    padding: spacing.lg,
    borderRadius: spacing.radiusBase,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  summaryHeadline: {
    ...typography.caption,
    color: palette.gray500,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
  },
  summaryText: {
    ...typography.body,
    color: palette.gray800,
    fontWeight: '500',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: palette.gray100,
    marginVertical: spacing.lg,
  },
  sectionHeadline: {
    ...typography.h3,
    color: palette.gray900,
    marginBottom: spacing.md,
  },
  contentParagraph: {
    ...typography.bodyLarge,
    color: palette.gray700,
    lineHeight: 26,
  },
  formulasBox: {
    backgroundColor: palette.primarySurface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginTop: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: palette.primary,
  },
  formulasTitle: {
    ...typography.h4,
    color: palette.primary,
    marginBottom: spacing.xs,
  },
  formulaItem: {
    ...typography.code,
    color: palette.gray800,
    marginVertical: 2,
  },
  askPromptCard: {
    backgroundColor: palette.gray50,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginTop: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  askPromptTitle: {
    ...typography.h4,
    color: palette.gray900,
  },
  askPromptDesc: {
    ...typography.bodySmall,
    color: palette.gray500,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: spacing.md,
  },
  askInlineBtn: {
    backgroundColor: palette.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: spacing.radiusMd,
  },
  askInlineText: {
    ...typography.button,
    fontSize: 13,
    color: palette.white,
  },
  pagerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
  },
  pagerBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: palette.white,
    borderRadius: spacing.radiusSm,
    borderWidth: 1,
    borderColor: palette.gray300,
  },
  pagerBtnDisabled: {
    opacity: 0.4,
  },
  pagerText: {
    ...typography.button,
    fontSize: 13,
    color: palette.primary,
  },
  pagerTextDisabled: {
    color: palette.gray400,
  },
  pagerIndicator: {
    ...typography.caption,
    color: palette.gray500,
    fontWeight: '700',
  },
  floatingAskBtn: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: palette.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.radiusFull,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    minHeight: spacing.minTouchTarget,
  },
  floatingAskIcon: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  floatingAskText: {
    ...typography.button,
    color: palette.white,
  },
});
