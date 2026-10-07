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
import { useProfileStore } from '../store/profileStore';

interface ProfileSetupScreenProps {
  navigation: any;
}

const AVATARS = [
  { id: 'av_1', emoji: '🧑‍🎓' },
  { id: 'av_2', emoji: '👩‍🎓' },
  { id: 'av_3', emoji: '👦' },
  { id: 'av_4', emoji: '👧' },
];

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({
  navigation,
}) => {
  const { profile, setName, setAvatar } = useProfileStore();
  const [nameInput, setNameInput] = useState(profile.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatarId || 'av_1');

  const handleContinue = () => {
    if (nameInput.trim()) {
      setName(nameInput.trim());
    }
    setAvatar(selectedAvatar);
    navigation.navigate('EducationLevel');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepBadge}>STEP 1 OF 5</Text>
        <Text style={styles.title}>What's your name? 👋</Text>
        <Text style={styles.subtitle}>
          Guru will personalize explanations and practice for you
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Choose an Avatar</Text>
        <View style={styles.avatarRow}>
          {AVATARS.map((av) => (
            <TouchableOpacity
              key={av.id}
              style={[
                styles.avatarCircle,
                selectedAvatar === av.id && styles.avatarCircleActive,
              ]}
              onPress={() => setSelectedAvatar(av.id)}
              accessibilityRole="button"
              accessibilityLabel={`Select avatar ${av.emoji}`}
            >
              <Text style={styles.avatarEmoji}>{av.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Aarav"
          placeholderTextColor={palette.gray400}
          value={nameInput}
          onChangeText={setNameInput}
          autoFocus
        />

        <PrimaryButton
          title="Continue"
          onPress={handleContinue}
          style={styles.continueBtn}
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
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xl,
  },
  stepBadge: {
    ...typography.caption,
    color: palette.primary,
    fontWeight: '800',
    marginBottom: spacing.xs,
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
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.xl,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: palette.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarCircleActive: {
    borderColor: palette.primary,
    backgroundColor: palette.primarySurface,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  input: {
    backgroundColor: palette.gray50,
    borderWidth: 1,
    borderColor: palette.gray300,
    borderRadius: spacing.radiusMd,
    paddingHorizontal: spacing.md,
    minHeight: spacing.minTouchTarget,
    fontSize: 16,
    color: palette.gray900,
    marginBottom: spacing.xl,
  },
  continueBtn: {
    width: '100%',
  },
});
