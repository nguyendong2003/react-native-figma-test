import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { Icons, IconType } from '@/assets/icons';
import { Typography, Shadows } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export interface CardProps {
  /**
   * The variant type of the card: 'method' or 'beneficiary'.
   */
  variant: 'method' | 'beneficiary';
  /**
   * Title text (for 'method' variant).
   */
  title?: string;
  /**
   * Icon name from Icons registry. Required for 'method' variant and used for 'beneficiary' if provided.
   */
  iconName?: IconType;
  /**
   * Name of the beneficiary (for 'beneficiary' variant).
   */
  name?: string;
  /**
   * Whether this card is the "Add new" beneficiary button (for 'beneficiary' variant).
   */
  isAddNew?: boolean;
  /**
   * Whether the card is selected/active.
   */
  selected?: boolean;
  /**
   * Callback when the card is pressed.
   */
  onPress?: () => void;
  /**
   * Optional style override for the card container.
   */
  style?: StyleProp<ViewStyle>;
}

export function Card({
  variant,
  title = '',
  iconName,
  name = '',
  isAddNew = false,
  selected = false,
  onPress,
  style,
}: CardProps) {
  const { theme, activeColors } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'method') {
    // Active / Selected state: warning background (#ffaf2a), white text & icon
    // Inactive / Unselected state: neutral5 background (#e0e0e0), text & icon colored according to current theme
    const backgroundColor = selected ? activeColors.warning : activeColors.neutral5;
    const contentColor = selected ? '#ffffff' : activeColors.text;

    return (
      <TouchableOpacity
        style={[
          styles.methodCard,
          { backgroundColor },
          style,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityState={{ selected }}
      >
        {iconName && (
          <Image
            source={Icons[iconName]}
            style={styles.methodIcon}
            tintColor={contentColor}
            contentFit="contain"
          />
        )}
        <Text
          style={[
            styles.methodText,
            { color: contentColor },
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  // Beneficiary variant
  if (isAddNew) {
    return (
      <TouchableOpacity
        style={[
          styles.beneficiaryCard,
          styles.addNewCard,
          {
            backgroundColor: activeColors.surface,
            borderColor: activeColors.border,
          },
          theme === 'light' ? styles.shadow : null,
          style,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Add new beneficiary"
      >
        <View
          style={[
            styles.circle,
            { backgroundColor: activeColors.primaryLight },
          ]}
        >
          <Image
            source={Icons.eAdd}
            style={styles.addIcon}
            tintColor={activeColors.primary}
            contentFit="contain"
          />
        </View>
        <Text style={[styles.addNewText, { color: activeColors.text }]}>
          Add new
        </Text>
      </TouchableOpacity>
    );
  }

  // Beneficiary User Card
  const cardBgColor = selected ? activeColors.primary : activeColors.surface;
  const textColor = selected ? '#ffffff' : activeColors.text;
  const avatarBgColor = selected ? 'rgba(255, 255, 255, 0.2)' : activeColors.primaryLight;
  const avatarTextColor = selected ? '#ffffff' : activeColors.primary;
  const firstLetter = name ? name.charAt(0).toUpperCase() : '';

  return (
    <TouchableOpacity
      style={[
        styles.beneficiaryCard,
        { backgroundColor: cardBgColor },
        !selected && { borderColor: activeColors.border },
        theme === 'light' ? styles.shadow : null,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <View style={[styles.circle, { backgroundColor: avatarBgColor }]}>
        <Text style={[styles.avatarText, { color: avatarTextColor }]}>
          {firstLetter}
        </Text>
      </View>
      <Text
        style={[
          styles.userNameText,
          { color: textColor },
        ]}
        numberOfLines={1}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  methodCard: {
    width: 120,
    height: 100,
    borderRadius: 15,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  methodIcon: {
    width: 28,
    height: 28,
  },
  methodText: {
    ...Typography.caption2,
    textAlign: 'left',
  },
  beneficiaryCard: {
    width: 100,
    height: 120,
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  addNewCard: {
    borderStyle: 'dashed',
    borderWidth: 1.5,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  addIcon: {
    width: 24,
    height: 24,
  },
  addNewText: {
    ...Typography.caption2,
    fontSize: 11,
  },
  avatarText: {
    ...Typography.title3,
    fontSize: 18,
  },
  userNameText: {
    ...Typography.body3,
    fontSize: 13,
  },
  shadow: {
    ...Shadows.card2,
  },
});
