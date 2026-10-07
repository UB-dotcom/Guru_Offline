import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { TutorActionType } from '../types/tutor';

interface TutorActionButtonProps {
  label: string;
  actionType: TutorActionType;
  onPress: (action: TutorActionType) => void;
  icon?: string;
}

export const TutorActionButton: React.FC<TutorActionButtonProps> = ({
  label,
  actionType,
  onPress,
  icon,
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => onPress(actionType)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.text}>
        {icon ? `${icon}  ${label}` : label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: palette.primarySurface,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radiusFull,
    marginRight: spacing.sm,
    minHeight: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...typography.caption,
    color: palette.primary,
    fontWeight: '700',
    fontSize: 12,
  },
});
