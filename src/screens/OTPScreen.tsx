import React, { useState, useEffect } from 'react';
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
import { useAuthStore } from '../store/authStore';

interface OTPScreenProps {
  navigation: any;
  route: any;
}

export const OTPScreen: React.FC<OTPScreenProps> = ({ navigation, route }) => {
  const phone = route.params?.phone || '+91 98765 43210';
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(30);
  const { verifyOTP, isLoading } = useAuthStore();

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async () => {
    const success = await verifyOTP(otp || '123456');
    if (success) {
      navigation.navigate('Onboarding', { screen: 'ProfileSetup' });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>📱</Text>
        <Text style={styles.title}>Verify Your Phone</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit verification code to {'\n'}
          <Text style={styles.phoneHighlight}>{phone}</Text>
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Enter 6-digit OTP</Text>
        <TextInput
          style={styles.otpInput}
          placeholder="• • • • • •"
          placeholderTextColor={palette.gray400}
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
          autoFocus
        />

        <PrimaryButton
          title="Verify & Continue"
          onPress={handleVerify}
          loading={isLoading}
          style={styles.verifyBtn}
        />

        <View style={styles.resendRow}>
          {countdown > 0 ? (
            <Text style={styles.timerText}>Resend code in {countdown}s</Text>
          ) : (
            <TouchableOpacity onPress={() => setCountdown(30)}>
              <Text style={styles.resendLink}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>
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
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 44,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: palette.gray900,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: palette.gray500,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  phoneHighlight: {
    fontWeight: '700',
    color: palette.gray800,
  },
  card: {
    backgroundColor: palette.white,
    padding: spacing.xl,
    borderRadius: spacing.radiusBase,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  label: {
    ...typography.caption,
    color: palette.gray700,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  otpInput: {
    backgroundColor: palette.gray50,
    borderWidth: 1.5,
    borderColor: palette.primary,
    borderRadius: spacing.radiusMd,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 8,
    minHeight: 56,
    color: palette.gray900,
    marginBottom: spacing.lg,
  },
  verifyBtn: {
    marginBottom: spacing.md,
  },
  resendRow: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  timerText: {
    ...typography.bodySmall,
    color: palette.gray400,
  },
  resendLink: {
    ...typography.button,
    color: palette.primary,
    fontSize: 14,
  },
});
