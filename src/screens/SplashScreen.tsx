import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { useAuthStore } from '../store/authStore';

interface SplashScreenProps {
  navigation: any;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { isAuthenticated } = useAuthStore();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.92);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigation.replace('Main');
      } else {
        navigation.replace('Welcome');
      }
    }, 1400);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>🎓</Text>
        </View>

        <Text style={styles.title}>GURU OFFLINE</Text>
        <Text style={styles.subtitle}>Your AI tutor.</Text>
        <Text style={styles.tagline}>Works without internet.</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>📵 100% On-Device AI</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  content: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    ...typography.h1,
    color: palette.white,
    letterSpacing: 1.5,
    fontWeight: '900',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: '#E0F2FE',
    fontSize: 18,
  },
  tagline: {
    ...typography.body,
    color: '#BAE6FD',
    marginTop: 2,
  },
  badge: {
    marginTop: spacing.xxl,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.base,
    borderRadius: spacing.radiusFull,
  },
  badgeText: {
    ...typography.caption,
    color: palette.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
