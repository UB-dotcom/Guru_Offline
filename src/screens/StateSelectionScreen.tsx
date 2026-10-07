import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { useProfileStore } from '../store/profileStore';
import { SUPPORTED_STATES } from '../services/curriculumCatalog';

interface StateSelectionScreenProps {
  navigation: any;
}

export const StateSelectionScreen: React.FC<StateSelectionScreenProps> = ({ navigation }) => {
  const { profile, setState } = useProfileStore();

  const handleSelect = (stateId: string) => {
    setState(stateId);
  };

  const handleContinue = () => {
    navigation.navigate('ClassSelection');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepBadge}>STATE BOARD SELECTION</Text>
        <Text style={styles.title}>Select Your State</Text>
        <Text style={styles.subtitle}>
          Curriculum and regional subjects will be tailored for your state
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {SUPPORTED_STATES.map((s) => {
          const isSelected = profile.state === s.id;
          return (
            <TouchableOpacity
              key={s.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => handleSelect(s.id)}
              activeOpacity={0.7}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`${s.name}, ${s.boardName}`}
            >
              <View style={styles.textCol}>
                <View style={styles.titleRow}>
                  <Text style={[styles.stateName, isSelected && styles.stateNameSelected]}>
                    {s.name}
                  </Text>
                  {s.hindiName && (
                    <Text style={styles.hindiName}>({s.hindiName})</Text>
                  )}
                </View>
                <Text style={styles.boardDetail}>{s.boardName}</Text>
              </View>

              <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
                {isSelected && <Text style={styles.checkMark}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <PrimaryButton
        title="Continue to Class Selection"
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
    color: palette.warning,
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
    padding: spacing.md,
    borderRadius: spacing.radiusBase,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: palette.gray200,
    minHeight: spacing.minTouchTarget + 10,
  },
  cardSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.primarySurface,
  },
  textCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stateName: {
    ...typography.bodyLarge,
    fontWeight: '700',
    color: palette.gray900,
  },
  stateNameSelected: {
    color: palette.primary,
  },
  hindiName: {
    ...typography.bodySmall,
    color: palette.gray500,
  },
  boardDetail: {
    ...typography.caption,
    color: palette.gray500,
    marginTop: 2,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
    fontSize: 12,
    fontWeight: '900',
  },
  continueBtn: {
    marginTop: spacing.base,
  },
});
