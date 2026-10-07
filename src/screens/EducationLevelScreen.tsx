import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { EducationLevel } from '../types/student';
import { useProfileStore } from '../store/profileStore';

interface EducationLevelScreenProps {
  navigation: any;
}

const LEVELS: { id: EducationLevel; title: string; subtitle: string; icon: string }[] = [
  {
    id: 'primary',
    title: 'Primary School',
    subtitle: 'Classes 1–5',
    icon: '🎒',
  },
  {
    id: 'middle',
    title: 'Middle School',
    subtitle: 'Classes 6–8',
    icon: '📘',
  },
  {
    id: 'secondary',
    title: 'Secondary School',
    subtitle: 'Classes 9–10',
    icon: '🎓',
  },
  {
    id: 'higher_secondary',
    title: 'Higher Secondary',
    subtitle: 'Classes 11–12',
    icon: '📖',
  },
];

export const EducationLevelScreen: React.FC<EducationLevelScreenProps> = ({
  navigation,
}) => {
  const { profile, setEducationLevel } = useProfileStore();

  const handleSelect = (level: EducationLevel) => {
    setEducationLevel(level);
  };

  const handleContinue = () => {
    navigation.navigate('ClassSelection');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepBadge}>STEP 2 OF 5</Text>
        <Text style={styles.title}>Education Level</Text>
        <Text style={styles.subtitle}>Select the stage of your schooling</Text>
      </View>

      <View style={styles.cardsContainer}>
        {LEVELS.map((lvl) => {
          const isSelected = profile.educationLevel === lvl.id;
          return (
            <TouchableOpacity
              key={lvl.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => handleSelect(lvl.id)}
              activeOpacity={0.7}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`${lvl.title}, ${lvl.subtitle}`}
            >
              <View style={styles.cardIconCircle}>
                <Text style={styles.cardEmoji}>{lvl.icon}</Text>
              </View>

              <View style={styles.cardTextCol}>
                <Text style={[styles.cardTitle, isSelected && styles.cardTitleActive]}>
                  {lvl.title}
                </Text>
                <Text style={styles.cardSubtitle}>{lvl.subtitle}</Text>
              </View>

              <View style={[styles.radio, isSelected && styles.radioActive]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <PrimaryButton
        title="Continue"
        onPress={handleContinue}
        style={styles.continueBtn}
      />
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
  header: {
    marginBottom: spacing.base,
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
  cardsContainer: {
    marginVertical: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.white,
    padding: spacing.base,
    borderRadius: spacing.radiusBase,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: palette.gray200,
    minHeight: spacing.minTouchTarget + 10,
  },
  cardSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.primarySurface,
  },
  cardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardEmoji: {
    fontSize: 22,
  },
  cardTextCol: {
    flex: 1,
  },
  cardTitle: {
    ...typography.h4,
    color: palette.gray900,
  },
  cardTitleActive: {
    color: palette.primary,
    fontWeight: '700',
  },
  cardSubtitle: {
    ...typography.bodySmall,
    color: palette.gray500,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: palette.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: palette.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: palette.primary,
  },
  continueBtn: {
    marginTop: spacing.base,
  },
});
