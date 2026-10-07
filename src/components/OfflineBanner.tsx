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

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ showToggle = false, text }) => {
  const { isOfflineMode, toggleOfflineMode } = useModuleStore();

  return (
    <View
      style={[
        styles.container,
        isOfflineMode ? styles.offlineBg : styles.onlineBg,
      ]}
      accessibilityRole="header"
      accessibilityLabel={
        isOfflineMode
          ? 'Offline mode active, AI is running on this device'
          : 'Online mode active, downloads available'
      }
    >
      <View style={styles.textRow}>
        <Text style={styles.icon}>{isOfflineMode ? '📵' : '🌐'}</Text>
        <View style={styles.contentColumn}>
          <Text style={styles.title}>
            {text || (isOfflineMode ? 'OFFLINE MODE' : 'ONLINE MODE')}
          </Text>
          <Text style={styles.subtitle}>
            {isOfflineMode
              ? 'AI is running on this device • Zero data used'
              : 'Connected • Module downloads enabled'}
          </Text>
        </View>
      </View>

      {showToggle && (
        <TouchableOpacity
          onPress={toggleOfflineMode}
          style={styles.toggleBtn}
          accessibilityLabel="Toggle network mode"
        >
          <Text style={styles.toggleText}>
            {isOfflineMode ? 'Go Online' : 'Go Offline'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
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
