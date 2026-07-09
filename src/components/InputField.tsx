import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInputProps,
  NativeSyntheticEvent,
  FocusEvent,
  BlurEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { Icons, IconType } from '@/assets/icons';
import { useTheme } from '@/context/ThemeContext';
import { Typography } from '@/constants/theme';

export interface InputFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  caption?: string;
  rightIcon?: IconType;
  onRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  variant?: 'default' | 'exchange';
  currencyCode?: string;
  onCurrencyPress?: () => void;
}

export function InputField({
  label,
  error,
  caption,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  secureTextEntry,
  onFocus,
  onBlur,
  value,
  placeholderTextColor,
  variant = 'default',
  currencyCode,
  onCurrencyPress,
  ...restProps
}: InputFieldProps) {
  const { activeColors, isDarkMode } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = (e: FocusEvent) => {
    setIsFocused(true);
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleBlur = (e: BlurEvent) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  // Determine secure text state
  const isSecure = secureTextEntry && !isPasswordVisible;

  // Choose the right icon
  let resolvedRightIcon: IconType | undefined = rightIcon;
  let handleRightIconPress = onRightIconPress;

  if (secureTextEntry && !rightIcon) {
    resolvedRightIcon = 'eye';
    handleRightIconPress = () => {
      setIsPasswordVisible((prev) => !prev);
    };
  }

  // Border colors based on state
  let borderStyle = styles.borderDefault;
  let borderColor: string = activeColors.border;

  if (error) {
    borderStyle = styles.borderError;
    borderColor = activeColors.error;
  } else if (isFocused) {
    borderStyle = styles.borderFocused;
    borderColor = activeColors.primary;
  }

  // Icon tint color
  const iconTintColor = error
    ? activeColors.error
    : isFocused
    ? activeColors.primary
    : activeColors.placeholder;

  return (
    <View style={[styles.outerContainer, containerStyle]}>
      {/* Label */}
      {label && (
        <Text style={[styles.label, { color: activeColors.textMuted }]}>
          {label}
        </Text>
      )}

      {/* Input Container */}
      <View
        style={[
          styles.inputContainer,
          borderStyle,
          {
            backgroundColor: activeColors.surface,
            borderColor: borderColor,
          },
        ]}
      >
        <TextInput
          value={value}
          secureTextEntry={isSecure}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={placeholderTextColor ?? activeColors.placeholder}
          style={[
            styles.textInput,
            {
              color: activeColors.text,
            },
            inputStyle,
          ]}
          {...restProps}
        />

        {/* Exchange currency selector */}
        {variant === 'exchange' && (
          <>
            <View style={[styles.divider, { backgroundColor: activeColors.border }]} />
            <Pressable
              onPress={onCurrencyPress}
              disabled={!onCurrencyPress}
              style={({ pressed }) => [
                styles.currencySelector,
                pressed && onCurrencyPress && styles.iconPressed,
              ]}
            >
              <Text style={[styles.currencyText, { color: activeColors.text }]}>
                {currencyCode ?? 'USD'}
              </Text>
              <Image
                source={Icons.unfoldMore}
                style={styles.dropdownIcon}
                tintColor={activeColors.textMuted}
                contentFit="contain"
              />
            </Pressable>
          </>
        )}

        {/* Right Icon */}
        {variant === 'default' && resolvedRightIcon && (
          <Pressable
            onPress={handleRightIconPress}
            disabled={!handleRightIconPress}
            style={({ pressed }) => [
              styles.iconPressable,
              pressed && handleRightIconPress && styles.iconPressed,
            ]}
          >
            <Image
              source={Icons[resolvedRightIcon]}
              style={styles.rightIcon}
              tintColor={iconTintColor}
              contentFit="contain"
            />
          </Pressable>
        )}
      </View>

      {/* Caption or Error Helper Text */}
      {(error || caption) && (
        <Text
          style={[
            styles.caption,
            {
              color: error ? activeColors.error : activeColors.primary,
            },
          ]}
        >
          {error || caption}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    alignSelf: 'stretch',
  },
  label: {
    ...Typography.caption1,
    marginBottom: 8,
  },
  inputContainer: {
    height: 44,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  borderDefault: {},
  borderFocused: {},
  borderError: {},
  textInput: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    ...Typography.body3,
    minWidth: 0,
  },
  iconPressable: {
    padding: 4,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPressed: {
    opacity: 0.7,
  },
  rightIcon: {
    width: 20,
    height: 20,
  },
  caption: {
    ...Typography.caption1,
    marginTop: 8,
    paddingHorizontal: 12,
  },
  divider: {
    width: 1,
    height: 20,
    marginHorizontal: 12,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  currencyText: {
    ...Typography.body1,
    marginRight: 4,
  },
  dropdownIcon: {
    width: 12,
    height: 16,
  },
});
