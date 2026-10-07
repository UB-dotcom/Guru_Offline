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

interface SignupScreenProps {
  navigation: any;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signup, isLoading } = useAuthStore();

  const handleSignup = async () => {
    const success = await signup({
      fullName: fullName || 'New Student',
      emailOrPhone: emailOrPhone || 'student@school.edu',
      password: password || 'pass123',
      confirmPassword: confirmPassword || 'pass123',
    });

    if (success) {
      navigation.navigate('Onboarding', { screen: 'EducationLevel' });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account 🎒</Text>
        <Text style={styles.subtitle}>Join Guru Offline to download modules & learn anytime</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Aarav Sharma"
            placeholderTextColor={palette.gray400}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email or Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="student@school.edu or +91 9876543210"
            placeholderTextColor={palette.gray400}
            keyboardType="email-address"
            autoCapitalize="none"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Create password"
            placeholderTextColor={palette.gray400}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter password"
            placeholderTextColor={palette.gray400}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <PrimaryButton
          title="Create Account"
          onPress={handleSignup}
          loading={isLoading}
          style={styles.submitBtn}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Login</Text>
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
  submitBtn: {
    marginTop: spacing.sm,
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
  loginLink: {
    ...typography.body,
    color: palette.primary,
    fontWeight: '700',
  },
});
