import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { QuizOption as QuizOptionType } from '../types/quiz';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface QuizOptionProps {
  option: QuizOptionType;
  isSelected: boolean;
  isCorrect?: boolean | null;
  disabled?: boolean;
  onSelect: (optionId: string) => void;
}

export const QuizOption: React.FC<QuizOptionProps> = ({
  option,
  isSelected,
  isCorrect = null,
  disabled = false,
  onSelect,
}) => {
  const getContainerStyle = () => {
    if (isCorrect === true) return styles.correctContainer;
    if (isCorrect === false && isSelected) return styles.incorrectContainer;
    if (isSelected) return styles.selectedContainer;
    return styles.defaultContainer;
  };

  const getStatusIcon = () => {
    if (isCorrect === true) return '✓';
    if (isCorrect === false && isSelected) return '✗';
    return option.id;
  };

  return (
    <TouchableOpacity
      style={[styles.container, getContainerStyle()]}
      onPress={() => onSelect(option.id)}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected, disabled }}
      accessibilityLabel={`Option ${option.id}: ${option.text}`}
    >
      <View
        style={[
          styles.badge,
          isSelected && styles.selectedBadge,
          isCorrect === true && styles.correctBadge,
          isCorrect === false && isSelected && styles.incorrectBadge,
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            (isSelected || isCorrect !== null) && styles.badgeTextActive,
          ]}
        >
          {getStatusIcon()}
        </Text>
      </View>

      <Text
        style={[
          styles.optionText,
          isSelected && styles.selectedOptionText,
          isCorrect === true && styles.correctOptionText,
          isCorrect === false && isSelected && styles.incorrectOptionText,
        ]}
      >
        {option.text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: spacing.minTouchTarget,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
  },
  defaultContainer: {
    backgroundColor: palette.white,
    borderColor: palette.gray200,
  },
  selectedContainer: {
    backgroundColor: palette.primarySurface,
    borderColor: palette.primary,
  },
  correctContainer: {
    backgroundColor: palette.secondarySurface,
    borderColor: palette.secondary,
  },
  incorrectContainer: {
    backgroundColor: palette.dangerSurface,
    borderColor: palette.danger,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: palette.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  selectedBadge: {
    backgroundColor: palette.primary,
  },
  correctBadge: {
    backgroundColor: palette.secondary,
  },
  incorrectBadge: {
    backgroundColor: palette.danger,
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '800',
    color: palette.gray700,
  },
  badgeTextActive: {
    color: palette.white,
  },
  optionText: {
    ...typography.body,
    color: palette.gray900,
    flex: 1,
  },
  selectedOptionText: {
    fontWeight: '600',
    color: palette.primary,
  },
  correctOptionText: {
    fontWeight: '700',
    color: palette.secondary,
  },
  incorrectOptionText: {
    fontWeight: '600',
    color: palette.danger,
  },
});
