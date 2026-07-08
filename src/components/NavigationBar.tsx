import { Icons, IconType } from "@/assets/icons";
import { Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export interface NavigationBarProps {
  /**
   * The title text displayed in the navigation bar.
   */
  title: string;
  /**
   * Whether to show the back button. Defaults to true.
   */
  showBackButton?: boolean;
  /**
   * Optional callback function when the back button is pressed.
   * If not provided, it falls back to router.back().
   */
  onBackPress?: () => void;
  /**
   * Whether to show the action button on the right. Defaults to false.
   */
  showRightButton?: boolean;
  /**
   * Optional callback function when the right action button is pressed.
   */
  onRightPress?: () => void;
  /**
   * The icon name from the Icons registry to show on the right button.
   * Defaults to 'search'.
   */
  rightIconName?: IconType;
  /**
   * Optional override style for the outer container.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Optional override style for the title text.
   */
  titleStyle?: StyleProp<TextStyle>;
  /**
   * Optional tint color for the back button icon.
   */
  backButtonTint?: string;
  /**
   * Optional tint color for the right action button icon.
   */
  rightButtonTint?: string;
}

export function NavigationBar({
  title,
  showBackButton = true,
  onBackPress,
  showRightButton = false,
  onRightPress,
  rightIconName = "search",
  style,
  titleStyle,
  backButtonTint,
  rightButtonTint,
}: NavigationBarProps) {
  const { theme, activeColors } = useTheme();

  const handleBackPress =
    onBackPress ||
    (() => {
      if (router.canGoBack()) {
        router.back();
      }
    });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: activeColors.background,
          borderBottomColor: activeColors.border,
        },
        style,
      ]}
      accessibilityRole="header"
    >
      <View style={styles.contentRow}>
        {showBackButton && (
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Image
              source={Icons.arrowDownSignToNavigate}
              style={styles.backIcon}
              tintColor={backButtonTint || activeColors.text}
              contentFit="contain"
            />
          </TouchableOpacity>
        )}

        <Text
          style={[
            styles.title,
            { color: activeColors.text },
            !showBackButton && styles.titleNoBack,
            titleStyle,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {showRightButton && (
          <TouchableOpacity
            onPress={onRightPress}
            style={styles.rightButton}
            accessibilityLabel="Action"
            accessibilityRole="button"
          >
            <Image
              source={Icons[rightIconName]}
              style={styles.rightIcon}
              tintColor={rightButtonTint || activeColors.text}
              contentFit="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 53,
    width: "100%",
    borderBottomWidth: 1,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 28,
  },
  backButton: {
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  rightButton: {
    marginLeft: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    width: 16,
    height: 16,
  },
  rightIcon: {
    width: 20,
    height: 20,
  },
  title: {
    ...Typography.title2,
    flex: 1,
    textAlign: "left",
  },
  titleNoBack: {
    marginLeft: 0,
  },
});
