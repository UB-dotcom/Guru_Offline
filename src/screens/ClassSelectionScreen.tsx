import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { useProfileStore } from '../store/profileStore';

interface ClassSelectionScreenProps {
  navigation: any;
}

const CLASSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const ClassSelectionScreen: React.FC<ClassSelectionScreenProps> = ({
  navigation,
}) => {
  const { profile, setClassLevel, setStream } = useProfileStore();

  const handleSelect = (classNum: number) => {
    setClassLevel(classNum);
  };

  const handleContinue = () => {
    if (profile.classLevel >= 11) {
      navigation.navigate('StreamSelection');
    } else {
      setStream(null);
      navigation.navigate('SubjectSelection');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepBadge}>STEP 3 OF 6</Text>
        <Text style={styles.title}>Select Your Class</Text>
        <Text style={styles.subtitle}>
          Curriculum modules and practice questions will match your grade
        </Text>
      </View>

      <View style={styles.grid}>
        {CLASSES.map((c) => {
          const isSelected = profile.classLevel === c;
          const isSenior = c >= 11;
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
              {isSenior && (
                <View style={styles.streamBadge}>
                  <Text style={styles.streamBadgeText}>Stream</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <PrimaryButton
        title={profile.classLevel >= 11 ? 'Continue to Stream Selection' : 'Continue to Subject Selection'}
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
    width: '31%',
    backgroundColor: palette.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.radiusBase,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: palette.gray200,
    minHeight: spacing.minTouchTarget + 36,
  },
  gridCellSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.primarySurface,
  },
  classNumber: {
    fontSize: 26,
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
    marginTop: 2,
  },
  classLabelSelected: {
    color: palette.primary,
  },
  streamBadge: {
    backgroundColor: palette.gray100,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginTop: 4,
  },
  streamBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: palette.gray600,
  },
  continueBtn: {
    marginTop: spacing.base,
  },
});
