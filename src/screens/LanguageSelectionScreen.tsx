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

const LANGUAGES: { id: AppLanguage; title: string; subtitle: string; flag: string; badge: string }[] = [
  {
    id: 'hi',
    title: 'हिंदी (Hindi)',
    subtitle: 'राष्ट्रीय शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद (NCERT) माध्यम',
    flag: '🇮🇳',
    badge: 'लोकप्रिय',
  },
  {
    id: 'bilingual',
    title: 'Hinglish / Bilingual',
    subtitle: 'सरल हिंदी व्याख्या + English Technical & Formula Terms',
    flag: '🇮🇳 🇬🇧',
    badge: 'अनुशंसित (Recommended)',
  },
  {
    id: 'en',
    title: 'English',
    subtitle: 'Standard National Indian Curriculum Medium',
    flag: '🇬🇧',
    badge: 'Standard',
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
    navigation.navigate('BoardSelection');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Text style={styles.stepBadge}>STEP 1 OF 6</Text>
          <View style={styles.offlineBadge}>
            <Text style={styles.offlineBadgeText}>⚡ OFFLINE MODE</Text>
          </View>
        </View>
        <Text style={styles.title}>Preferred Language</Text>
        <Text style={styles.subtitle}>
          Choose your learning medium for AI tutor explanations and textbooks
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
                <View style={styles.titleRow}>
                  <Text style={[styles.langTitle, isSelected && styles.langTitleSelected]}>
                    {item.title}
                  </Text>
                  {item.badge && (
                    <View style={[styles.pillBadge, isSelected && styles.pillBadgeSelected]}>
                      <Text style={[styles.pillBadgeText, isSelected && styles.pillBadgeTextSelected]}>
                        {item.badge}
                      </Text>
                    </View>
                  )}
                </View>
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
        title="Continue to Board Selection"
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  stepBadge: {
    ...typography.caption,
    color: palette.primary,
    fontWeight: '800',
  },
  offlineBadge: {
    backgroundColor: palette.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.radiusSm,
  },
  offlineBadgeText: {
    ...typography.caption,
    color: palette.white,
    fontWeight: '700',
    fontSize: 10,
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
    minHeight: spacing.minTouchTarget + 24,
  },
  cardSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.primarySurface,
  },
  flagEmoji: {
    fontSize: 28,
    marginRight: spacing.base,
  },
  textCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  langTitle: {
    ...typography.h3,
    color: palette.gray900,
  },
  langTitleSelected: {
    color: palette.primary,
    fontWeight: '800',
  },
  pillBadge: {
    backgroundColor: palette.gray100,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pillBadgeSelected: {
    backgroundColor: palette.primary,
  },
  pillBadgeText: {
    ...typography.caption,
    fontSize: 10,
    color: palette.gray600,
    fontWeight: '700',
  },
  pillBadgeTextSelected: {
    color: palette.white,
  },
  langSubtitle: {
    ...typography.bodySmall,
    color: palette.gray500,
    marginTop: 4,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: palette.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
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
