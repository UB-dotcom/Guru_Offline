import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
  accessibilityLabel?: string;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
  icon,
  accessibilityLabel,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled }}
    >
      <Text style={[styles.text, disabled && styles.textDisabled, textStyle]}>
        {icon ? `${icon}  ${title}` : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: palette.primary,
    minHeight: spacing.minTouchTarget,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.radiusBase,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    borderColor: palette.gray300,
  },
  text: {
    ...typography.button,
    color: palette.primary,
    textAlign: 'center',
  },
  textDisabled: {
    color: palette.gray400,
  },
});
