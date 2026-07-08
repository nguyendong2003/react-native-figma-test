import { Icons } from "@/assets/icons";
import { Button } from "@/components/Button";
import { InputField } from "@/components/InputField";
import { Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const { theme, activeColors } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    agree;

  const handleSignUp = () => {
    if (!isFormValid) return;

    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", `Account created for: ${email}`);
      router.replace("/signin");
    }, 1500);
  };

  const handleSignIn = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/signin");
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            theme === "light" ? activeColors.primary1 : activeColors.background,
        },
      ]}
      edges={["bottom"]}
    >
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 15px purple gap as shown in Figma geometry (y:93 to y:108) */}
          <View style={styles.headerGap} />

          {/* White Body Card (Rectangle 33) */}
          <View
            style={[styles.bodyCard, { backgroundColor: activeColors.surface }]}
          >
            <Text style={[styles.welcomeText, { color: activeColors.primary }]}>
              Welcome to us,
            </Text>

            <Text style={[styles.subtitleText, { color: activeColors.text }]}>
              Hello there, create New account
            </Text>

            {/* Centered Illustration */}
            <Image
              source={Icons.signupIllustration}
              style={styles.illustration}
              contentFit="contain"
            />

            {/* Input Form Fields */}
            <View style={styles.formContainer}>
              <InputField
                placeholder="Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
              />

              <InputField
                placeholder="Text input"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <InputField
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                rightIconName="eye"
                onIconPress={() => setShowPassword(!showPassword)}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Terms and Conditions Checkbox */}
            <TouchableOpacity
              onPress={() => setAgree(!agree)}
              style={styles.checkboxRow}
              activeOpacity={0.8}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: agree }}
              accessibilityLabel="Agree to Terms and Conditions"
            >
              <View
                style={[
                  styles.checkboxBox,
                  { borderColor: agree ? activeColors.primary : "#bfbfbf" },
                  agree && { backgroundColor: activeColors.primary },
                ]}
              >
                {agree && <View style={styles.checkboxCheckInner} />}
              </View>
              <Text
                style={[styles.checkboxLabel, { color: activeColors.text }]}
              >
                By creating an account you agree{"\n"}
                to our{" "}
                <Text
                  style={{
                    color: activeColors.primary,
                    fontFamily: "Poppins-SemiBold",
                  }}
                >
                  Terms and Conditions
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Action Buttons */}
            <Button
              title="Sign up"
              loading={loading}
              disabled={!isFormValid}
              onPress={handleSignUp}
              style={styles.signUpButton}
            />

            {/* Sign In Link Row */}
            <View style={styles.signInRow}>
              <Text
                style={[styles.haveAccountText, { color: activeColors.text }]}
              >
                Have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={handleSignIn}
                accessibilityRole="button"
                accessibilityLabel="Sign In"
              >
                <Text
                  style={[styles.signInText, { color: activeColors.primary }]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerGap: {
    height: 15,
  },
  bodyCard: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  welcomeText: {
    ...Typography.title1,
    marginBottom: 4,
  },
  subtitleText: {
    ...Typography.caption2,
    marginBottom: 32,
  },
  illustration: {
    width: 213,
    height: 165,
    alignSelf: "center",
    marginBottom: 32,
  },
  formContainer: {
    gap: 20,
    alignSelf: "stretch",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    alignSelf: "stretch",
    marginTop: 20,
    marginBottom: 32,
    gap: 12,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkboxCheckInner: {
    width: 10,
    height: 10,
    backgroundColor: "#ffffff",
    borderRadius: 2,
  },
  checkboxLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  signUpButton: {
    alignSelf: "stretch",
    marginBottom: 24,
  },
  signInRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  haveAccountText: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    lineHeight: 16,
  },
  signInText: {
    ...Typography.caption1,
  },
});
