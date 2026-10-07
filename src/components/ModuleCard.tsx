import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LearningModule } from '../types/module';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface ModuleCardProps {
  module: LearningModule;
  onOpen: (moduleId: string) => void;
  onDownload: (moduleId: string) => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  onOpen,
  onDownload,
}) => {
  const getSubjectIcon = (subject: string) => {
    if (subject.toLowerCase().includes('math')) return '📐';
    if (subject.toLowerCase().includes('sci')) return '🔬';
    return '📚';
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>{getSubjectIcon(module.subject)}</Text>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.title}>{module.title}</Text>
          <Text style={styles.meta}>
            Class {module.classNumber} • {module.totalChapters} Chapters • ~{module.sizeMB} MB
          </Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {module.description}
      </Text>

      {module.isDownloading && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${module.downloadProgress}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Downloading {module.downloadProgress}%...
          </Text>
        </View>
      )}

      <View style={styles.footerRow}>
        {module.downloaded ? (
          <>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>✓ Available Offline</Text>
            </View>
            <TouchableOpacity
              style={styles.openBtn}
              onPress={() => onOpen(module.id)}
              accessibilityRole="button"
              accessibilityLabel={`Open ${module.title}`}
            >
              <Text style={styles.openBtnText}>Open</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.sizeText}>~{module.sizeMB} MB</Text>
            <TouchableOpacity
              style={[
                styles.downloadBtn,
                module.isDownloading && styles.downloadBtnDisabled,
              ]}
              onPress={() => onDownload(module.id)}
              disabled={module.isDownloading}
              accessibilityRole="button"
              accessibilityLabel={`Download ${module.title}`}
            >
              <Text style={styles.downloadBtnText}>
                {module.isDownloading ? 'Downloading...' : 'Download'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.white,
    borderRadius: spacing.radiusBase,
    padding: spacing.base,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 22,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    ...typography.h4,
    color: palette.gray900,
  },
  meta: {
    ...typography.caption,
    color: palette.gray500,
    marginTop: 2,
  },
  description: {
    ...typography.bodySmall,
    color: palette.gray600,
    marginVertical: spacing.sm,
  },
  progressContainer: {
    marginVertical: spacing.sm,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: palette.gray200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: palette.primary,
  },
  progressText: {
    ...typography.caption,
    color: palette.primary,
    marginTop: 4,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: palette.gray100,
  },
  badge: {
    backgroundColor: palette.secondarySurface,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: spacing.radiusSm,
  },
  badgeText: {
    ...typography.caption,
    color: palette.secondary,
    fontWeight: '700',
  },
  sizeText: {
    ...typography.bodySmall,
    color: palette.gray500,
    fontWeight: '600',
  },
  openBtn: {
    backgroundColor: palette.primary,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.base,
    borderRadius: spacing.radiusMd,
    minHeight: 36,
    justifyContent: 'center',
  },
  openBtnText: {
    ...typography.button,
    fontSize: 13,
    color: palette.white,
  },
  downloadBtn: {
    backgroundColor: palette.primarySurface,
    borderWidth: 1,
    borderColor: palette.primary,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.base,
    borderRadius: spacing.radiusMd,
    minHeight: 36,
    justifyContent: 'center',
  },
  downloadBtnDisabled: {
    backgroundColor: palette.gray100,
    borderColor: palette.gray300,
  },
  downloadBtnText: {
    ...typography.button,
    fontSize: 13,
    color: palette.primary,
  },
});
