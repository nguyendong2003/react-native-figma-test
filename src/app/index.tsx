import { Button } from "@/components/Button";
import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import { StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { isDarkMode, toggleTheme, activeColors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: activeColors.background }]}
    >
      <Text style={[styles.text, { color: activeColors.text }]}>
        Hello World
      </Text>

      <View style={styles.toggleContainer}>
        <Text style={[styles.toggleText, { color: activeColors.text }]}>
          Dark Mode
        </Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: "#767577", true: activeColors.primary }}
          thumbColor={isDarkMode ? "#ffffff" : "#f4f3f4"}
        />
      </View>

      <Button
        title="Sign in"
        style={styles.button}
        onPress={() => router.push("/signin")}
      />

      <Button
        title="Sign up"
        style={styles.button}
        onPress={() => router.push("/signup")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 16,
  },
  text: {
    fontFamily: "Poppins-Medium",
    fontSize: 24,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 16,
  },
  toggleText: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
  button: {
    width: 267,
  },
});
