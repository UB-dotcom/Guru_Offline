import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface DownloadProgressProps {
  moduleTitle: string;
  progressPercent: number;
  downloadedMB: number;
  totalMB: number;
  isPaused: boolean;
  isError?: boolean;
  errorMessage?: string;
  onPause: () => void;
  onResume: () => void;
  onRetry?: () => void;
}

export const DownloadProgress: React.FC<DownloadProgressProps> = ({
  moduleTitle,
  progressPercent,
  downloadedMB,
  totalMB,
  isPaused,
  isError = false,
  errorMessage,
  onPause,
  onResume,
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{moduleTitle}</Text>

      {isError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {errorMessage || 'Connection interrupted. Your progress is saved.'}
          </Text>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onRetry || onResume}
            accessibilityRole="button"
            accessibilityLabel="Resume download"
          >
            <Text style={styles.actionBtnText}>Resume</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>
              {isPaused ? 'Paused' : 'Downloading...'}
            </Text>
            <Text style={styles.percentLabel}>{progressPercent}%</Text>
          </View>

          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPercent}%` },
                isPaused && styles.progressBarPaused,
              ]}
            />
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.sizeText}>
              {downloadedMB} MB / {totalMB} MB
            </Text>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={isPaused ? onResume : onPause}
              accessibilityRole="button"
              accessibilityLabel={isPaused ? 'Resume download' : 'Pause download'}
            >
              <Text style={styles.actionBtnText}>
                {isPaused ? 'Resume' : 'Pause'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.white,
    padding: spacing.base,
    borderRadius: spacing.radiusBase,
    borderWidth: 1,
    borderColor: palette.gray200,
    marginVertical: spacing.md,
  },
  title: {
    ...typography.h4,
    color: palette.gray900,
    marginBottom: spacing.xs,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  statusLabel: {
    ...typography.caption,
    color: palette.gray600,
    fontWeight: '600',
  },
  percentLabel: {
    ...typography.caption,
    color: palette.primary,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: palette.gray200,
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: palette.primary,
  },
  progressBarPaused: {
    backgroundColor: palette.warning,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  sizeText: {
    ...typography.bodySmall,
    color: palette.gray500,
  },
  actionBtn: {
    backgroundColor: palette.primarySurface,
    borderWidth: 1,
    borderColor: palette.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.base,
    borderRadius: spacing.radiusMd,
    minHeight: 34,
    justifyContent: 'center',
  },
  actionBtnText: {
    ...typography.button,
    fontSize: 12,
    color: palette.primary,
  },
  errorBox: {
    backgroundColor: palette.warningSurface,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    ...typography.bodySmall,
    color: palette.warning,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.sm,
  },
});
