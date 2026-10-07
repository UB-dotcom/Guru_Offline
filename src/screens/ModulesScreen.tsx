import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ModuleCard } from '../components/ModuleCard';
import { OfflineBanner } from '../components/OfflineBanner';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { useModuleStore } from '../store/moduleStore';

interface ModulesScreenProps {
  navigation: any;
}

export const ModulesScreen: React.FC<ModulesScreenProps> = ({ navigation }) => {
  const { modules, setActiveModule, downloadModule } = useModuleStore();

  const downloadedModules = modules.filter((m) => m.downloaded);
  const availableModules = modules.filter((m) => !m.downloaded);

  const handleOpen = (moduleId: string) => {
    setActiveModule(moduleId);
    navigation.navigate('ModuleDetails', { moduleId });
  };

  const handleDownload = (moduleId: string) => {
    navigation.navigate('ModuleDownload', { moduleId });
  };

  return (
    <View style={styles.screen}>
      <OfflineBanner />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Curriculum Modules 📚</Text>
          <Text style={styles.subtitle}>
            Manage your offline textbooks and practice materials
          </Text>
        </View>

        {/* Downloaded Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>
            Downloaded ({downloadedModules.length})
          </Text>
          <Text style={styles.sectionSub}>
            Ready for on-device AI tutoring without internet
          </Text>

          {downloadedModules.length > 0 ? (
            downloadedModules.map((m) => (
              <ModuleCard
                key={m.id}
                module={m}
                onOpen={handleOpen}
                onDownload={handleDownload}
              />
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No modules downloaded yet.</Text>
            </View>
          )}
        </View>

        {/* Available to Download Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>
            Available to Download ({availableModules.length})
          </Text>
          <Text style={styles.sectionSub}>
            Connect to internet to install on your phone
          </Text>

          {availableModules.map((m) => (
            <ModuleCard
              key={m.id}
              module={m}
              onOpen={handleOpen}
              onDownload={handleDownload}
            />
          ))}
        </View>
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
  header: {
    marginVertical: spacing.md,
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
  section: {
    marginTop: spacing.base,
  },
  sectionHeader: {
    ...typography.h3,
    color: palette.gray900,
  },
  sectionSub: {
    ...typography.caption,
    color: palette.gray500,
    marginBottom: spacing.md,
    marginTop: 2,
  },
  emptyCard: {
    backgroundColor: palette.white,
    padding: spacing.lg,
    borderRadius: spacing.radiusBase,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  emptyText: {
    ...typography.body,
    color: palette.gray400,
  },
});
