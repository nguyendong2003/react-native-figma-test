import { Icons, IconType } from '@/assets/icons';
import { Typography } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Image } from 'expo-image';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  title?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'ghost' | 'round' | 'link';
  loading?: boolean;
  icon?: IconType;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  icon,
  style,
  textStyle,
  ...pressableProps
}: ButtonProps) {
  const { activeColors } = useTheme();

  // Helper to determine text color
  const getTextColor = () => {
    if (disabled || loading) {
      if (variant === 'ghost') {
        return activeColors.placeholder; // Figma uses Neutral/4 (#cacaca) for disabled ghost button text
      }
    }

    switch (variant) {
      case 'secondary':
      case 'outline':
      case 'text':
      case 'link':
        return activeColors.primary;
      case 'ghost':
        return activeColors.error;
      case 'primary':
      case 'round':
      default:
        return '#ffffff'; // Always white for primary and round icon buttons as per Figma specs
    }
  };

  // Helper to determine background color
  const getBackgroundColor = () => {
    if (variant === 'text' || variant === 'outline' || variant === 'link') {
      return 'transparent';
    }

    if (disabled || loading) {
      if (variant === 'primary' || variant === 'round') {
        return activeColors.primaryLight; // Figma uses Primary/4 (#f2f1f9) for disabled primary/round buttons
      }
    }

    if (variant === 'ghost') {
      return activeColors.surface;
    }

    if (variant === 'secondary') {
      return activeColors.primaryLight;
    }

    // primary or round
    return activeColors.primary;
  };

  // Helper to determine border color
  const getBorderColor = () => {
    if (variant === 'outline') {
      return activeColors.primary;
    }
    return 'transparent';
  };

  const getTextStylePreset = () => {
    if (variant === 'link') {
      return Typography.caption1;
    }
    return styles.textBase;
  };

  const textColor = getTextColor();

  return (
    <Pressable
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.buttonBase,
        variant === 'round' && styles.buttonRound,
        variant === 'link' && styles.buttonLink,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          opacity:
            disabled || loading
              ? variant === 'primary' ||
                variant === 'ghost' ||
                variant === 'round'
                ? 1
                : 0.6
              : pressed
                ? 0.85
                : 1, // Opacity transition when pressed
          transform: [{ scale: pressed && !disabled && !loading ? 0.98 : 1 }],
        },
        style,
      ]}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator size='small' color={textColor} />
      ) : variant === 'round' ? (
        <Image
          source={icon ? Icons[icon] : Icons.arrowDownSignToNavigate}
          style={styles.buttonIcon}
          tintColor={textColor}
          contentFit='contain'
        />
      ) : (
        <Text style={[getTextStylePreset(), { color: textColor }, textStyle]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    height: 44,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    flexDirection: 'row',
  },
  buttonRound: {
    width: 44,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 0,
    alignSelf: 'center',
  },
  buttonLink: {
    height: 'auto',
    borderRadius: 0,
    paddingHorizontal: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  buttonIcon: {
    width: 20,
    height: 20,
  },
  textBase: {
    ...Typography.body1,
    textAlign: 'center',
  },
});
