import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ModuleCard } from '../components/ModuleCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { useModuleStore } from '../store/moduleStore';

interface ModuleSelectionScreenProps {
  navigation: any;
}

export const ModuleSelectionScreen: React.FC<ModuleSelectionScreenProps> = ({
  navigation,
}) => {
  const { modules, downloadModule } = useModuleStore();

  const handleOpen = (moduleId: string) => {
    navigation.navigate('Main', {
      screen: 'ModulesTab',
      params: { screen: 'ModuleDetails', params: { moduleId } },
    });
  };

  const handleDownload = (moduleId: string) => {
    navigation.navigate('ModuleDownload', { moduleId });
  };

  const handleComplete = () => {
    navigation.replace('Main');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepBadge}>STEP 5 OF 5</Text>
        <Text style={styles.title}>Choose What to Learn</Text>
        <Text style={styles.subtitle}>
          Download only what you need while internet is available.
        </Text>
      </View>

      <View style={styles.noticeCard}>
        <Text style={styles.noticeIcon}>💡</Text>
        <Text style={styles.noticeText}>
          Once downloaded, you can turn off Wi-Fi and mobile data. All AI explanations, reading, and quizzes work 100% offline!
        </Text>
      </View>

      <View style={styles.list}>
        {modules.map((m) => (
          <ModuleCard
            key={m.id}
            module={m}
            onOpen={handleOpen}
            onDownload={handleDownload}
          />
        ))}
      </View>

      <PrimaryButton
        title="Go to Home Dashboard"
        onPress={handleComplete}
        style={styles.doneBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: palette.gray50,
    padding: spacing.xl,
  },
  header: {
    marginBottom: spacing.base,
  },
  stepBadge: {
    ...typography.caption,
    color: palette.primary,
    fontWeight: '800',
    marginBottom: spacing.xs,
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
    backgroundColor: palette.secondarySurface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
  },
  noticeIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  noticeText: {
    ...typography.caption,
    color: '#065F46',
    flex: 1,
    lineHeight: 16,
  },
  list: {
    marginBottom: spacing.lg,
  },
  doneBtn: {
    marginTop: spacing.sm,
  },
});
