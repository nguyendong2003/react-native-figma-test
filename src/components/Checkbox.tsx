import React from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { Icons } from '@/assets/icons';
import { useTheme } from '@/context/ThemeContext';
import { Typography } from '@/constants/theme';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export function Checkbox({
  checked,
  onChange,
  disabled = false,
  label,
  style,
  labelStyle,
}: CheckboxProps) {
  const { activeColors } = useTheme();

  const handlePress = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  // Determine container styling
  const boxStyles = [
    styles.box,
    {
      borderColor: checked
        ? disabled
          ? activeColors.border
          : activeColors.primary
        : activeColors.border,
      backgroundColor: 'transparent',
    },
  ];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      hitSlop={4}
    >
      <View style={boxStyles}>
        {checked && (
          <Image
            source={Icons.check}
            style={styles.checkIcon}
            tintColor={disabled ? activeColors.border : activeColors.primary}
            contentFit="contain"
          />
        )}
      </View>

      {label && (
        <Text
          style={[
            styles.label,
            { color: disabled ? activeColors.placeholder : activeColors.text },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    width: 14,
    height: 14,
  },
  label: {
    ...Typography.body2,
    marginLeft: 8,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.6,
  },
});
