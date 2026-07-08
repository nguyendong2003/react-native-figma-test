import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Typography } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  /**
   * The text displayed on the button.
   */
  title: string;
  /**
   * If true, displays a loading spinner instead of the button text.
   */
  loading?: boolean;
  /**
   * Optional style overrides for the button container.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Optional style overrides for the button text label.
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * Button style variant. Defaults to 'primary'.
   */
  variant?: 'primary';
}

export function Button({
  title,
  loading = false,
  disabled = false,
  style,
  textStyle,
  variant = 'primary',
  activeOpacity = 0.8,
  ...rest
}: ButtonProps) {
  const { theme, activeColors } = useTheme();

  const isDark = theme === 'dark';
  
  // Disabled styling based on Figma (Primary / 4 background) and accessible contrast
  const disabledBgColor = isDark ? activeColors.primaryLight : activeColors.primary4;
  const disabledTextColor = isDark ? activeColors.neutral3 : activeColors.primary3;

  const containerBgColor = disabled ? disabledBgColor : activeColors.primary;
  const labelTextColor = disabled ? disabledTextColor : activeColors.neutral6;

  const buttonStyle = [
    styles.container,
    {
      backgroundColor: containerBgColor,
    },
    style,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled || loading}
      activeOpacity={activeOpacity}
      accessibilityRole="button"
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={labelTextColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: labelTextColor }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    alignSelf: 'stretch',
  },
  text: {
    ...Typography.body1,
  },
});
