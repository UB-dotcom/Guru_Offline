import React from 'react';
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
import { useProfileStore } from '../store/profileStore';
import { useModuleStore } from '../store/moduleStore';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { profile } = useProfileStore();
  const { modules, setActiveModule } = useModuleStore();

  const activeModule = modules.find((m) => m.id === profile.activeSubjectId) || modules[0];

  const handleContinueLearning = () => {
    setActiveModule(activeModule.id);
    navigation.navigate('Reader', {
      moduleId: activeModule.id,
      chapterId: activeModule.lastAccessedChapterId || 'ch04',
    });
  };

  const handleOpenModule = (moduleId: string) => {
    setActiveModule(moduleId);
    navigation.navigate('ModulesTab', {
      screen: 'ModuleDetails',
      params: { moduleId },
    });
  };

  return (
    <View style={styles.screen}>
      <OfflineBanner showToggle={true} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* App Top Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.appTitle}>GURU OFFLINE</Text>
            <Text style={styles.greeting}>👋 Hello, {profile.name}!</Text>
          </View>

          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('Settings')}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Learning Card */}
        <View style={styles.continueCard}>
          <View style={styles.continueHeader}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>CONTINUE LEARNING</Text>
            </View>
            <Text style={styles.chapterNum}>Chapter 4</Text>
          </View>

          <Text style={styles.subjectTitle}>📐 {activeModule.subject}</Text>
          <Text style={styles.topicTitle}>Quadratic Equations</Text>

          <View style={styles.progressRow}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '78%' }]} />
            </View>
            <Text style={styles.progressPercent}>78%</Text>
          </View>

          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleContinueLearning}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Continue reading chapter 4"
          >
            <Text style={styles.continueBtnText}>Continue Reading ➔</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Practice Card */}
        <View style={styles.quickPracticeCard}>
          <View style={styles.practiceLeft}>
            <Text style={styles.practiceIcon}>⚡</Text>
            <View>
              <Text style={styles.practiceTitle}>Quick Practice</Text>
              <Text style={styles.practiceSub}>5 Questions on Quadratic Equations</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.startPracticeBtn}
            onPress={() => navigation.navigate('Practice', { topic: 'Quadratic Equations' })}
            accessibilityRole="button"
            accessibilityLabel="Start 5 practice questions"
          >
            <Text style={styles.startPracticeText}>Start</Text>
          </TouchableOpacity>
        </View>

        {/* My Modules Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Modules</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('ModulesTab')}
          >
            <Text style={styles.seeAllText}>Browse All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.modulesGrid}>
          {modules
            .filter((m) => m.downloaded)
            .map((m) => (
              <TouchableOpacity
                key={m.id}
                style={styles.moduleItem}
                onPress={() => handleOpenModule(m.id)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`${m.title}, available offline`}
              >
                <Text style={styles.modEmoji}>
                  {m.subject.toLowerCase().includes('math') ? '📐' : '🔬'}
                </Text>
                <Text style={styles.modTitle}>{m.subject}</Text>
                <Text style={styles.modClass}>Class {m.classNumber}</Text>
                <View style={styles.offlineChip}>
                  <Text style={styles.offlineChipText}>✓ Ready Offline</Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>

        {/* Ask Guru Promo Banner */}
        <TouchableOpacity
          style={styles.askGuruCard}
          onPress={() => navigation.navigate('TutorTab')}
          activeOpacity={0.8}
        >
          <View style={styles.askLeft}>
            <Text style={styles.robotEmoji}>🤖</Text>
            <View>
              <Text style={styles.askTitle}>Ask Guru Anytime</Text>
              <Text style={styles.askSub}>
                Step-by-step answers running locally on your phone
              </Text>
            </View>
          </View>
          <Text style={styles.askArrow}>➔</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.gray50,
  },
  container: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  appTitle: {
    ...typography.caption,
    color: palette.primary,
    fontWeight: '800',
    letterSpacing: 1,
  },
  greeting: {
    ...typography.h2,
    color: palette.gray900,
    marginTop: 2,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  settingsIcon: {
    fontSize: 20,
  },
  continueCard: {
    backgroundColor: palette.primary,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    marginVertical: spacing.md,
  },
  continueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  badgeText: {
    ...typography.caption,
    color: palette.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  chapterNum: {
    ...typography.caption,
    color: '#BAE6FD',
    fontWeight: '600',
  },
  subjectTitle: {
    ...typography.h4,
    color: '#E0F2FE',
    marginTop: spacing.xs,
  },
  topicTitle: {
    ...typography.h2,
    color: palette.white,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: palette.white,
  },
  progressPercent: {
    ...typography.caption,
    color: palette.white,
    fontWeight: '800',
  },
  continueBtn: {
    backgroundColor: palette.white,
    borderRadius: spacing.radiusMd,
    paddingVertical: spacing.md,
    alignItems: 'center',
    minHeight: spacing.minTouchTarget,
    justifyContent: 'center',
  },
  continueBtnText: {
    ...typography.button,
    color: palette.primary,
  },
  quickPracticeCard: {
    backgroundColor: palette.white,
    borderRadius: spacing.radiusBase,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  practiceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  practiceIcon: {
    fontSize: 26,
    marginRight: spacing.md,
  },
  practiceTitle: {
    ...typography.h4,
    color: palette.gray900,
  },
  practiceSub: {
    ...typography.bodySmall,
    color: palette.gray500,
    marginTop: 2,
  },
  startPracticeBtn: {
    backgroundColor: palette.primarySurface,
    borderWidth: 1,
    borderColor: palette.primary,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.base,
    borderRadius: spacing.radiusMd,
    minHeight: 36,
    justifyContent: 'center',
  },
  startPracticeText: {
    ...typography.button,
    fontSize: 13,
    color: palette.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: palette.gray900,
  },
  seeAllText: {
    ...typography.button,
    fontSize: 13,
    color: palette.primary,
  },
  modulesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moduleItem: {
    width: '48%',
    backgroundColor: palette.white,
    padding: spacing.base,
    borderRadius: spacing.radiusBase,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  modEmoji: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  modTitle: {
    ...typography.h4,
    color: palette.gray900,
  },
  modClass: {
    ...typography.caption,
    color: palette.gray500,
    marginTop: 2,
  },
  offlineChip: {
    backgroundColor: palette.secondarySurface,
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginTop: spacing.sm,
  },
  offlineChipText: {
    ...typography.caption,
    fontSize: 10,
    color: palette.secondary,
    fontWeight: '700',
  },
  askGuruCard: {
    backgroundColor: palette.white,
    padding: spacing.base,
    borderRadius: spacing.radiusBase,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
  },
  askLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  robotEmoji: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  askTitle: {
    ...typography.h4,
    color: palette.primary,
  },
  askSub: {
    ...typography.bodySmall,
    color: palette.gray500,
    marginTop: 2,
  },
  askArrow: {
    fontSize: 16,
    color: palette.primary,
    fontWeight: '900',
    marginLeft: spacing.sm,
  },
});
