import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading curriculum...',
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={palette.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    minHeight: 200,
  },
  text: {
    ...typography.body,
    color: palette.gray500,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
