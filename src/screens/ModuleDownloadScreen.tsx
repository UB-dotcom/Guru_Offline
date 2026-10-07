import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DownloadProgress } from '../components/DownloadProgress';
import { PrimaryButton } from '../components/PrimaryButton';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { useModuleStore } from '../store/moduleStore';

interface ModuleDownloadScreenProps {
  navigation: any;
  route: any;
}

export const ModuleDownloadScreen: React.FC<ModuleDownloadScreenProps> = ({
  navigation,
  route,
}) => {
  const moduleId = route.params?.moduleId || 'class10_math';
  const { modules, downloadModule, pauseDownload, resumeDownload } = useModuleStore();
  const currentModule = modules.find((m) => m.id === moduleId) || modules[0];

  const [progressPercent, setProgressPercent] = useState(
    currentModule.downloadProgress || 20
  );
  const [isPaused, setIsPaused] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    downloadModule(moduleId);

    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        if (isPaused || isError) return prev;
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 12;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [moduleId, isPaused, isError]);

  const downloadedMB = Math.round((progressPercent / 100) * currentModule.sizeMB);

  const handleOpenModule = () => {
    navigation.navigate('Main', {
      screen: 'ModulesTab',
      params: { screen: 'ModuleDetails', params: { moduleId } },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Module Download</Text>
        <Text style={styles.subtitle}>
          Downloading verified NCERT curriculum data & RAG index
        </Text>
      </View>

      <DownloadProgress
        moduleTitle={currentModule.title}
        progressPercent={Math.min(100, progressPercent)}
        downloadedMB={downloadedMB}
        totalMB={currentModule.sizeMB}
        isPaused={isPaused}
        isError={isError}
        onPause={() => {
          setIsPaused(true);
          pauseDownload(moduleId);
        }}
        onResume={() => {
          setIsPaused(false);
          setIsError(false);
          resumeDownload(moduleId);
        }}
        onRetry={() => {
          setIsError(false);
          setIsPaused(false);
          resumeDownload(moduleId);
        }}
      />

      {progressPercent >= 100 && (
        <View style={styles.successCard}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>Available Offline</Text>
          <Text style={styles.successDesc}>
            {currentModule.title} is now stored securely on your phone. You can turn off Wi-Fi and mobile data anytime!
          </Text>

          <PrimaryButton
            title="Open Module"
            onPress={handleOpenModule}
            style={styles.openBtn}
          />
        </View>
      )}

      {/* Development trigger to simulate network drop */}
      <View style={styles.devTools}>
        <Text style={styles.devTitle}>Demo Controls:</Text>
        <Text
          style={styles.devLink}
          onPress={() => setIsError(!isError)}
        >
          {isError ? 'Simulate Reconnection' : 'Simulate Connection Interruption'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: palette.gray50,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.lg,
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
  successCard: {
    backgroundColor: palette.secondarySurface,
    padding: spacing.xl,
    borderRadius: spacing.radiusBase,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: palette.secondary,
    marginTop: spacing.lg,
  },
  successIcon: {
    fontSize: 36,
    color: palette.secondary,
    fontWeight: '900',
    marginBottom: spacing.sm,
  },
  successTitle: {
    ...typography.h3,
    color: palette.gray900,
  },
  successDesc: {
    ...typography.bodySmall,
    color: '#065F46',
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  openBtn: {
    width: '100%',
    backgroundColor: palette.secondary,
  },
  devTools: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: palette.gray100,
    borderRadius: spacing.radiusSm,
    alignItems: 'center',
  },
  devTitle: {
    ...typography.caption,
    color: palette.gray500,
  },
  devLink: {
    ...typography.caption,
    color: palette.primary,
    fontWeight: '700',
    marginTop: 2,
  },
});
