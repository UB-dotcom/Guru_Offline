import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { AppLanguage } from '../types/student';
import { useProfileStore } from '../store/profileStore';

interface LanguageSelectionScreenProps {
  navigation: any;
}

const LANGUAGES: { id: AppLanguage; title: string; subtitle: string; flag: string }[] = [
  {
    id: 'en',
    title: 'English',
    subtitle: 'Standard Indian School Curriculum',
    flag: '🇬🇧',
  },
  {
    id: 'hi',
    title: 'हिंदी (Hindi)',
    subtitle: 'राष्ट्रीय शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद',
    flag: '🇮🇳',
  },
];

export const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({
  navigation,
}) => {
  const { profile, setLanguage } = useProfileStore();

  const handleSelect = (lang: AppLanguage) => {
    setLanguage(lang);
  };

  const handleContinue = () => {
    navigation.navigate('ModuleSelection');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepBadge}>STEP 4 OF 5</Text>
        <Text style={styles.title}>Preferred Language</Text>
        <Text style={styles.subtitle}>
          Choose the language for AI explanations and textbooks
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {LANGUAGES.map((item) => {
          const isSelected = profile.language === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => handleSelect(item.id)}
              activeOpacity={0.7}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`${item.title}, ${item.subtitle}`}
            >
              <Text style={styles.flagEmoji}>{item.flag}</Text>

              <View style={styles.textCol}>
                <Text style={[styles.langTitle, isSelected && styles.langTitleSelected]}>
                  {item.title}
                </Text>
                <Text style={styles.langSubtitle}>{item.subtitle}</Text>
              </View>

              <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
                {isSelected && <Text style={styles.checkMark}>✓</Text>}
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
    padding: spacing.lg,
    borderRadius: spacing.radiusBase,
    marginBottom: spacing.base,
    borderWidth: 2,
    borderColor: palette.gray200,
    minHeight: spacing.minTouchTarget + 20,
  },
  cardSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.primarySurface,
  },
  flagEmoji: {
    fontSize: 32,
    marginRight: spacing.base,
  },
  textCol: {
    flex: 1,
  },
  langTitle: {
    ...typography.h3,
    color: palette.gray900,
  },
  langTitleSelected: {
    color: palette.primary,
    fontWeight: '800',
  },
  langSubtitle: {
    ...typography.bodySmall,
    color: palette.gray500,
    marginTop: 2,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: palette.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.primary,
  },
  checkMark: {
    color: palette.white,
    fontSize: 14,
    fontWeight: '900',
  },
  continueBtn: {
    marginTop: spacing.base,
  },
});
