import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface ErrorStateProps {
  type?: 'offline' | 'download_failed' | 'generic';
  title?: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = 'offline',
  title,
  description,
  actionTitle,
  onAction,
}) => {
  const getDefaults = () => {
    switch (type) {
      case 'offline':
        return {
          icon: '📵',
          title: 'No Internet',
          description:
            'Guru can still teach you using your downloaded modules.\nAI is running locally on this device.',
          action: 'Continue Offline',
        };
      case 'download_failed':
        return {
          icon: '⚠️',
          title: 'Download failed',
          description:
            'Connection was interrupted.\nYour previous progress is safe.',
          action: 'Retry Download',
        };
      default:
        return {
          icon: 'ℹ️',
          title: 'Notice',
          description: 'Something needs attention.',
          action: 'Continue',
        };
    }
  };

  const defaults = getDefaults();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{defaults.icon}</Text>
      <Text style={styles.title}>{title || defaults.title}</Text>
      <Text style={styles.description}>{description || defaults.description}</Text>

      {onAction && (
        <PrimaryButton
          title={actionTitle || defaults.action}
          onPress={onAction}
          style={styles.actionBtn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.white,
    borderRadius: spacing.radiusBase,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  icon: {
    fontSize: 44,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: palette.gray900,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.body,
    color: palette.gray600,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  actionBtn: {
    minWidth: 180,
  },
});
