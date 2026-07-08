import { Icons, IconType } from "@/assets/icons";
import { Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { Image } from "expo-image";
import { useState } from "react";
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TargetedEvent,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export interface InputFieldProps extends Omit<TextInputProps, "style"> {
  /**
   * Optional label text displayed above the input field.
   */
  label?: string;
  /**
   * Optional helper or caption text displayed below the input field.
   */
  caption?: string;
  /**
   * Optional error message. If provided, the border and caption/error text will use the error color.
   */
  error?: string;
  /**
   * Optional icon name from the Icons registry to show on the right of the input field.
   */
  rightIconName?: IconType;
  /**
   * Optional callback when the right icon is pressed.
   */
  onIconPress?: () => void;
  /**
   * Optional callback when the entire input field is pressed (e.g., for dropdowns).
   */
  onPress?: () => void;
  /**
   * Style override for the outermost container wrapper.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style override for the inner input container box (holds the TextInput and Icon).
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Style override for the TextInput itself.
   */
  inputStyle?: StyleProp<TextStyle>;
  /**
   * Style override for the label text.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Style override for the caption/error text.
   */
  captionStyle?: StyleProp<TextStyle>;
}

export function InputField({
  label,
  caption,
  error,
  rightIconName,
  onIconPress,
  onPress,
  style,
  containerStyle,
  inputStyle,
  labelStyle,
  captionStyle,
  placeholderTextColor,
  onFocus,
  onBlur,
  ...rest
}: InputFieldProps) {
  const { theme, activeColors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const isDropdown = !!onPress;
  const resolvedRightIconName =
    rightIconName || (isDropdown ? "unfoldMore" : undefined);

  const handleFocus = (e: NativeSyntheticEvent<TargetedEvent>) => {
    setIsFocused(true);
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleBlur = (e: NativeSyntheticEvent<TargetedEvent>) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  const defaultBorderColor = theme === "dark" ? activeColors.border : "#cbcbcb";
  let borderColor = defaultBorderColor;
  if (error) {
    borderColor = activeColors.error;
  } else if (isFocused) {
    borderColor = activeColors.primary;
  }

  const showCaption = !!(error || caption);
  const captionText = error || caption;
  const captionColor = error ? activeColors.error : activeColors.primary;

  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <Text
          style={[styles.label, { color: activeColors.textMuted }, labelStyle]}
        >
          {label}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: activeColors.background,
            borderColor,
          },
          containerStyle,
        ]}
        onPress={onPress}
        disabled={!isDropdown}
        activeOpacity={0.8}
        accessibilityRole={isDropdown ? "button" : undefined}
      >
        <TextInput
          style={[styles.input, { color: activeColors.text }, inputStyle]}
          placeholderTextColor={
            placeholderTextColor || activeColors.placeholder
          }
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!isDropdown}
          pointerEvents={isDropdown ? "none" : undefined}
          {...rest}
        />

        {resolvedRightIconName && (
          <TouchableOpacity
            onPress={onIconPress || onPress}
            disabled={!onIconPress && !isDropdown}
            style={styles.iconContainer}
            accessibilityRole={onIconPress ? "button" : "image"}
            accessibilityLabel={resolvedRightIconName}
          >
            <Image
              source={Icons[resolvedRightIconName]}
              style={styles.icon}
              tintColor={error ? activeColors.error : activeColors.text}
              contentFit="contain"
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {showCaption && (
        <Text style={[styles.caption, { color: captionColor }, captionStyle]}>
          {captionText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
  },
  label: {
    ...Typography.caption1,
    marginBottom: 6,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 12,
    alignSelf: "stretch",
  },
  input: {
    flex: 1,
    height: "100%",
    ...Typography.body3,
    padding: 0, // Reset default Android paddings
    minWidth: 0,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  caption: {
    ...Typography.caption1,
    marginTop: 8,
    paddingHorizontal: 12,
  },
});
