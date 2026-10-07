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
import { useAuthStore } from '../store/authStore';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [loginMode, setLoginMode] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    if (loginMode === 'phone') {
      navigation.navigate('OTP', { phone: phone || '+91 98765 43210' });
      return;
    }

    const success = await login({
      emailOrPhone: email || 'student@school.edu',
      password: password || 'password',
      type: 'email',
    });

    if (success) {
      navigation.replace('Main');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Sign in to sync your curriculum and progress</Text>
      </View>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleTab, loginMode === 'email' && styles.toggleTabActive]}
          onPress={() => setLoginMode('email')}
          accessibilityRole="tab"
          accessibilityState={{ selected: loginMode === 'email' }}
        >
          <Text
            style={[
              styles.toggleText,
              loginMode === 'email' && styles.toggleTextActive,
            ]}
          >
            Email
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleTab, loginMode === 'phone' && styles.toggleTabActive]}
          onPress={() => setLoginMode('phone')}
          accessibilityRole="tab"
          accessibilityState={{ selected: loginMode === 'phone' }}
        >
          <Text
            style={[
              styles.toggleText,
              loginMode === 'phone' && styles.toggleTextActive,
            ]}
          >
            Phone
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        {loginMode === 'email' ? (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="student@school.edu"
                placeholderTextColor={palette.gray400}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor={palette.gray400}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotBtn}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <PrimaryButton
              title="Login"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.submitBtn}
            />
          </>
        ) : (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 98765 43210"
                placeholderTextColor={palette.gray400}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <PrimaryButton
              title="Send OTP"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.submitBtn}
            />
          </>
        )}

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.googleBtn}
          onPress={() => navigation.replace('Main')}
          accessibilityRole="button"
          accessibilityLabel="Continue with Google"
        >
          <Text style={styles.googleBtnText}>🔍  Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.guestBtn}
          onPress={() => navigation.replace('Main')}
          accessibilityRole="button"
          accessibilityLabel="Continue as Guest Offline"
        >
          <Text style={styles.guestBtnText}>📵  Continue Offline as Guest</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupLink}>Create Account</Text>
        </TouchableOpacity>
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
  title: {
    ...typography.h1,
    color: palette.gray900,
  },
  subtitle: {
    ...typography.body,
    color: palette.gray500,
    marginTop: spacing.xs,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: palette.gray200,
    borderRadius: spacing.radiusMd,
    padding: 3,
    marginBottom: spacing.lg,
  },
  toggleTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: spacing.radiusSm,
  },
  toggleTabActive: {
    backgroundColor: palette.white,
  },
  toggleText: {
    ...typography.button,
    fontSize: 13,
    color: palette.gray600,
  },
  toggleTextActive: {
    color: palette.primary,
  },
  form: {
    backgroundColor: palette.white,
    padding: spacing.lg,
    borderRadius: spacing.radiusBase,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  inputGroup: {
    marginBottom: spacing.md,
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
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: spacing.base,
    padding: spacing.xs,
  },
  forgotText: {
    ...typography.caption,
    color: palette.primary,
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: spacing.xs,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: palette.gray200,
  },
  dividerText: {
    ...typography.caption,
    color: palette.gray400,
    marginHorizontal: spacing.sm,
  },
  googleBtn: {
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.gray300,
    borderRadius: spacing.radiusBase,
    minHeight: spacing.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  googleBtnText: {
    ...typography.button,
    color: palette.gray700,
    fontSize: 14,
  },
  guestBtn: {
    backgroundColor: palette.secondarySurface,
    borderWidth: 1,
    borderColor: palette.secondary,
    borderRadius: spacing.radiusBase,
    minHeight: spacing.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestBtnText: {
    ...typography.button,
    color: palette.secondary,
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.body,
    color: palette.gray500,
  },
  signupLink: {
    ...typography.body,
    color: palette.primary,
    fontWeight: '700',
  },
});
