import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface ForgotPasswordScreenProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back to Login</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your registered email or phone to receive instructions
        </Text>
      </View>

      <View style={styles.card}>
        {isSubmitted ? (
          <View style={styles.successBox}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successTitle}>Instructions Sent</Text>
            <Text style={styles.successMsg}>
              If an account exists for {emailOrPhone || 'your contact'}, we have sent password reset details.
            </Text>
            <PrimaryButton
              title="Return to Login"
              onPress={() => navigation.navigate('Login')}
              style={styles.backLoginBtn}
            />
          </View>
        ) : (
          <>
            <Text style={styles.label}>Email or Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="student@school.edu or +91 9876543210"
              placeholderTextColor={palette.gray400}
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
            />

            <PrimaryButton
              title="Send Reset Instructions"
              onPress={() => setIsSubmitted(true)}
              style={styles.resetBtn}
            />
          </>
        )}
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
    marginBottom: spacing.xl,
  },
  backBtn: {
    marginBottom: spacing.base,
    minHeight: 36,
    justifyContent: 'center',
  },
  backText: {
    ...typography.button,
    color: palette.primary,
    fontSize: 14,
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
  card: {
    backgroundColor: palette.white,
    padding: spacing.lg,
    borderRadius: spacing.radiusBase,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  label: {
    ...typography.caption,
    color: palette.gray700,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: palette.gray50,
    borderWidth: 1,
    borderColor: palette.gray300,
    borderRadius: spacing.radiusMd,
    paddingHorizontal: spacing.md,
    minHeight: spacing.minTouchTarget,
    fontSize: 15,
    color: palette.gray900,
    marginBottom: spacing.lg,
  },
  resetBtn: {
    marginTop: spacing.xs,
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  successIcon: {
    fontSize: 36,
    color: palette.secondary,
    marginBottom: spacing.sm,
  },
  successTitle: {
    ...typography.h3,
    color: palette.gray900,
    marginBottom: spacing.xs,
  },
  successMsg: {
    ...typography.body,
    color: palette.gray500,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  backLoginBtn: {
    width: '100%',
  },
});
