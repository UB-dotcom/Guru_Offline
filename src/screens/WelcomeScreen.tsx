import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface WelcomeScreenProps {
  navigation: any;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.heroSection}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.title}>GURU OFFLINE</Text>
        <Text style={styles.subtitle}>Your AI tutor.</Text>
        <Text style={styles.tagline}>Works without internet.</Text>
      </View>

      <View style={styles.featuresCard}>
        <View style={styles.featureRow}>
          <Text style={styles.featureIcon}>📵</Text>
          <View style={styles.featureTextCol}>
            <Text style={styles.featureTitle}>Learn anywhere</Text>
            <Text style={styles.featureDesc}>No Wi-Fi or mobile data needed to study</Text>
          </View>
        </View>

        <View style={styles.featureRow}>
          <Text style={styles.featureIcon}>🧠</Text>
          <View style={styles.featureTextCol}>
            <Text style={styles.featureTitle}>AI runs on your phone</Text>
            <Text style={styles.featureDesc}>Private, fast local small language model</Text>
          </View>
        </View>

        <View style={styles.featureRow}>
          <Text style={styles.featureIcon}>📚</Text>
          <View style={styles.featureTextCol}>
            <Text style={styles.featureTitle}>Download your curriculum</Text>
            <Text style={styles.featureDesc}>Store textbooks and practice tests locally</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <PrimaryButton
          title="Create Account / Get Started"
          onPress={() => {
            if (navigation.canGoBack?.() || navigation.getState?.()?.routeNames?.includes('Signup')) {
              navigation.navigate('Signup');
            } else {
              navigation.navigate('Auth', { screen: 'Signup' });
            }
          }}
          style={styles.mainBtn}
        />

        <SecondaryButton
          title="Login"
          onPress={() => {
            if (navigation.canGoBack?.() || navigation.getState?.()?.routeNames?.includes('Login')) {
              navigation.navigate('Login');
            } else {
              navigation.navigate('Auth', { screen: 'Login' });
            }
          }}
          style={styles.loginBtn}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: palette.gray50,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  heroSection: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: palette.primaryLight || '#9B7EFC',
    marginBottom: spacing.base,
    elevation: 4,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    ...typography.h1,
    color: palette.gray900,
    letterSpacing: 1,
    fontWeight: '900',
  },
  subtitle: {
    ...typography.bodyLarge,
    color: palette.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  tagline: {
    ...typography.body,
    color: palette.gray500,
    marginTop: 2,
  },
  featuresCard: {
    backgroundColor: palette.white,
    padding: spacing.lg,
    borderRadius: spacing.radiusBase,
    marginVertical: spacing.xl,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  featureIcon: {
    fontSize: 26,
    marginRight: spacing.base,
  },
  featureTextCol: {
    flex: 1,
  },
  featureTitle: {
    ...typography.h4,
    color: palette.gray900,
    fontSize: 15,
  },
  featureDesc: {
    ...typography.bodySmall,
    color: palette.gray500,
    marginTop: 2,
  },
  actionsSection: {
    marginBottom: spacing.base,
  },
  mainBtn: {
    marginBottom: spacing.md,
  },
  loginBtn: {
    backgroundColor: palette.white,
  },
});
