import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Icons, IconType } from '@/assets/icons';
import { useTheme } from '@/context/ThemeContext';
import { Typography } from '@/constants/theme';

export interface NavigationBarProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightIcon?: IconType;
  onRightIconPress?: () => void;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  tintColor?: string;
}

export function NavigationBar({
  title,
  showBackButton = true,
  onBackPress,
  rightIcon,
  onRightIconPress,
  style,
  titleStyle,
  tintColor,
}: NavigationBarProps) {
  const router = useRouter();
  const { activeColors } = useTheme();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const resolvedTintColor = tintColor ?? activeColors.text;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: activeColors.surface },
        style,
      ]}
    >
      {/* Left Slot: Back Button */}
      {showBackButton ? (
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
          hitSlop={8}
        >
          <Image
            source={Icons.arrowDownSignToNavigate}
            style={styles.backIcon}
            tintColor={resolvedTintColor}
            contentFit="contain"
          />
        </Pressable>
      ) : null}

      {/* Center Slot: Title Text */}
      <Text
        numberOfLines={1}
        style={[
          styles.title,
          { color: resolvedTintColor },
          titleStyle,
        ]}
      >
        {title}
      </Text>

      {/* Right Slot: Custom Icon */}
      {rightIcon ? (
        <Pressable
          onPress={onRightIconPress}
          disabled={!onRightIconPress}
          style={({ pressed }) => [
            styles.rightButton,
            pressed && onRightIconPress && styles.pressed,
          ]}
          hitSlop={8}
        >
          <Image
            source={Icons[rightIcon]}
            style={styles.rightIcon}
            tintColor={resolvedTintColor}
            contentFit="contain"
          />
        </Pressable>
      ) : (
        // Spacing placeholder to balance layout when backButton is present and title is flex:1
        showBackButton ? <View style={styles.rightPlaceholder} /> : null
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 53,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 0,
  },
  backButton: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 6,
  },
  backIcon: {
    width: 16,
    height: 16,
  },
  title: {
    ...Typography.title2,
    flex: 1,
    textAlign: 'left',
    marginBottom: 0,
  },
  rightButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    marginBottom: 4,
  },
  rightIcon: {
    width: 20,
    height: 20,
  },
  rightPlaceholder: {
    width: 16, // Matches width of backButton to ensure title centers or aligns properly
    marginLeft: 16,
    marginBottom: 6,
  },
  pressed: {
    opacity: 0.7,
  },
});
