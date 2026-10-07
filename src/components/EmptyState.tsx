import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📚',
  title,
  description,
  actionTitle,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {actionTitle && onAction && (
        <PrimaryButton
          title={actionTitle}
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
    fontSize: 48,
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
    color: palette.gray500,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  actionBtn: {
    minWidth: 160,
  },
});
