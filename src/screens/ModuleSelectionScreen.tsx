import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ModuleCard } from '../components/ModuleCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { useModuleStore } from '../store/moduleStore';
import { useProfileStore } from '../store/profileStore';
import { filterModulesForProfile } from '../services/curriculumCatalog';

interface ModuleSelectionScreenProps {
  navigation: any;
}

export const ModuleSelectionScreen: React.FC<ModuleSelectionScreenProps> = ({
  navigation,
}) => {
  const { modules, downloadModule } = useModuleStore();
  const { profile } = useProfileStore();

  const filteredModules = filterModulesForProfile(
    modules,
    profile.board,
    profile.state,
    profile.classLevel,
    profile.stream,
    profile.selectedSubjects,
    profile.language
  );

  const handleOpen = (moduleId: string) => {
    navigation.navigate('Main', {
      screen: 'ModulesTab',
      params: { screen: 'ModuleDetails', params: { moduleId } },
    });
  };

  const handleDownload = (moduleId: string) => {
    downloadModule(moduleId);
  };

  const handleComplete = () => {
    navigation.replace('Main');
  };

  const isHindi = profile.language === 'hi' || profile.language === 'bilingual';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Text style={styles.stepBadge}>STEP 6 OF 6</Text>
          <View style={styles.profileBadge}>
            <Text style={styles.profileBadgeText}>
              Class {profile.classLevel} • {profile.board.toUpperCase()}
              {profile.state ? ` • ${profile.state.toUpperCase()}` : ''}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>
          {isHindi ? 'ऑफ़लाइन मॉड्यूल डाउनलोड' : 'Curriculum Modules'}
        </Text>
        <Text style={styles.subtitle}>
          {isHindi
            ? 'अपनी पसंद के विषय डाउनलोड करें। इसके बाद इंटरनेट की आवश्यकता नहीं होगी।'
            : 'Download curriculum packs from cloud storage to enable offline AI tutor & quizzes.'}
        </Text>
      </View>

      <View style={styles.noticeCard}>
        <Text style={styles.noticeIcon}>📵</Text>
        <View style={styles.noticeTextCol}>
          <Text style={styles.noticeTitle}>Zero Internet Required</Text>
          <Text style={styles.noticeText}>
            Once downloaded, all textbook readings, RAG searches, and AI answers run locally on your phone.
          </Text>
        </View>
      </View>

      <View style={styles.list}>
        {filteredModules.length > 0 ? (
          filteredModules.map((m) => (
            <ModuleCard
              key={m.id}
              module={m}
              onOpen={handleOpen}
              onDownload={handleDownload}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>Curriculum Module Ready</Text>
            <Text style={styles.emptySubtitle}>
              Class {profile.classLevel} {profile.board.toUpperCase()} modules are being prepared for offline storage.
            </Text>
          </View>
        )}
      </View>

      <PrimaryButton
        title="Start Learning Now 🚀"
        onPress={handleComplete}
        style={styles.completeBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: palette.gray50,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: spacing.base,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  stepBadge: {
    ...typography.caption,
    color: palette.primary,
    fontWeight: '800',
  },
  profileBadge: {
    backgroundColor: palette.primarySurface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.radiusSm,
    borderWidth: 1,
    borderColor: palette.primary,
  },
  profileBadgeText: {
    ...typography.caption,
    color: palette.primary,
    fontWeight: '700',
    fontSize: 10,
  },
  title: {
    ...typography.h1,
    color: palette.gray900,
  },
  subtitle: {
    ...typography.body,
    color: palette.gray500,
    marginTop: spacing.xs,
  },
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: spacing.base,
    borderRadius: spacing.radiusBase,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  noticeIcon: {
    fontSize: 26,
    marginRight: spacing.sm,
  },
  noticeTextCol: {
    flex: 1,
  },
  noticeTitle: {
    ...typography.bodyLarge,
    fontWeight: '800',
    color: '#92400E',
  },
  noticeText: {
    ...typography.caption,
    color: '#B45309',
    marginTop: 2,
  },
  list: {
    marginVertical: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: palette.white,
    borderRadius: spacing.radiusBase,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    ...typography.h3,
    color: palette.gray800,
  },
  emptySubtitle: {
    ...typography.bodySmall,
    color: palette.gray500,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  completeBtn: {
    marginTop: spacing.base,
  },
});
