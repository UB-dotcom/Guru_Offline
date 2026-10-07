import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useModuleStore } from '../store/moduleStore';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface OfflineBannerProps {
  showToggle?: boolean;
  text?: string;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = () => {
  // Offline mode banner removed from top header per user specification
  return null;
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: spacing.minTouchTarget,
  },
  offlineBg: {
    backgroundColor: palette.secondary,
  },
  onlineBg: {
    backgroundColor: palette.primary,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  contentColumn: {
    flex: 1,
  },
  title: {
    ...typography.caption,
    color: palette.white,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  subtitle: {
    ...typography.caption,
    color: '#E0F2FE',
    fontSize: 10,
    marginTop: 1,
  },
  toggleBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.radiusSm,
    minHeight: 32,
    justifyContent: 'center',
  },
  toggleText: {
    ...typography.caption,
    color: palette.white,
    fontWeight: '700',
  },
});
