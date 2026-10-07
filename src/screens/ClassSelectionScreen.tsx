import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { GradeClass } from '../types/student';
import { useProfileStore } from '../store/profileStore';

interface ClassSelectionScreenProps {
  navigation: any;
}

const CLASSES: GradeClass[] = [5, 6, 7, 8, 9, 10, 11, 12];

export const ClassSelectionScreen: React.FC<ClassSelectionScreenProps> = ({
  navigation,
}) => {
  const { profile, setClassNumber } = useProfileStore();

  const handleSelect = (classNum: GradeClass) => {
    setClassNumber(classNum);
  };

  const handleContinue = () => {
    navigation.navigate('LanguageSelection');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepBadge}>STEP 3 OF 5</Text>
        <Text style={styles.title}>Select Your Class</Text>
        <Text style={styles.subtitle}>
          Curriculum modules will be customized for your grade
        </Text>
      </View>

      <View style={styles.grid}>
        {CLASSES.map((c) => {
          const isSelected = profile.classNumber === c;
          return (
            <TouchableOpacity
              key={c}
              style={[styles.gridCell, isSelected && styles.gridCellSelected]}
              onPress={() => handleSelect(c)}
              activeOpacity={0.7}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`Class ${c}`}
            >
              <Text
                style={[styles.classNumber, isSelected && styles.classNumberSelected]}
              >
                {c}
              </Text>
              <Text
                style={[styles.classLabel, isSelected && styles.classLabelSelected]}
              >
                Class {c}
              </Text>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: spacing.md,
  },
  gridCell: {
    width: '48%',
    backgroundColor: palette.white,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.base,
    borderRadius: spacing.radiusBase,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: palette.gray200,
    minHeight: spacing.minTouchTarget + 30,
  },
  gridCellSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.primarySurface,
  },
  classNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: palette.gray800,
  },
  classNumberSelected: {
    color: palette.primary,
  },
  classLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: palette.gray500,
    marginTop: spacing.xs,
  },
  classLabelSelected: {
    color: palette.primary,
  },
  continueBtn: {
    marginTop: spacing.base,
  },
});
