import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationBar } from '@/components/NavigationBar';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/Button';
import { Icons } from '@/assets/icons';
import { Colors, Typography } from '@/constants/theme';

export default function SignInScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const activeColors = Colors[theme];
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid = email.trim().length > 0 && password.trim().length > 0;

  const handleSignIn = () => {
    if (!isFormValid) return;

    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', `Signed in as: ${email}`);
    }, 1500);
  };

  const handleFingerprintPress = () => {
    Alert.alert('Biometric Authentication', 'Fingerprint scanner activated.');
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset instructions have been sent.');
  };

  const handleSignUp = () => {
    Alert.alert('Navigation', 'Navigate to Sign Up Screen.');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'light' ? activeColors.primary1 : activeColors.background }]}>
      <StatusBar style="light" />
      
      {/* Top Safe Area Spacing */}
      <View style={{ height: insets.top, backgroundColor: theme === 'light' ? activeColors.primary1 : activeColors.background }} />
      
      {/* Navigation Header */}
      <NavigationBar
        title="Sign in"
        showBackButton={true}
        backButtonTint={theme === 'light' ? activeColors.neutral6 : activeColors.text}
        style={{
          backgroundColor: theme === 'light' ? activeColors.primary1 : activeColors.background,
          borderBottomWidth: 0,
        }}
        titleStyle={{
          color: theme === 'light' ? activeColors.neutral6 : activeColors.text,
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 15px purple gap as shown in Figma geometry (y:93 to y:108) */}
          <View style={styles.headerGap} />

          {/* White Body Card (Rectangle 33) */}
          <View style={[styles.bodyCard, { backgroundColor: activeColors.surface }]}>
            <Text style={[styles.welcomeText, { color: activeColors.primary }]}>
              Welcome Back
            </Text>
            
            <Text style={[styles.subtitleText, { color: activeColors.text }]}>
              Hello there, sign in to continue
            </Text>

            {/* Centered Illustration */}
            <Image
              source={Icons.signinIllustration}
              style={styles.illustration}
              contentFit="contain"
            />

            {/* Input Form Fields */}
            <View style={styles.formContainer}>
              <InputField
                placeholder="Username or email"
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

            {/* Forgot Password Link */}
            <TouchableOpacity 
              onPress={handleForgotPassword} 
              style={styles.forgotPasswordContainer}
              accessibilityRole="button"
              accessibilityLabel="Forgot your password"
            >
              <Text style={[styles.forgotPasswordText, { color: activeColors.placeholder }]}>
                Forgot your password ?
              </Text>
            </TouchableOpacity>

            {/* Action Buttons */}
            <Button
              title="Sign in"
              loading={loading}
              disabled={!isFormValid}
              onPress={handleSignIn}
              style={styles.signInButton}
            />

            {/* Fingerprint Authentication */}
            <TouchableOpacity
              onPress={handleFingerprintPress}
              style={styles.fingerprintButton}
              accessibilityRole="button"
              accessibilityLabel="Biometric Sign In"
            >
              <Image
                source={Icons.fingerprint}
                style={[styles.fingerprintIcon, { tintColor: activeColors.primary }]}
                contentFit="contain"
              />
            </TouchableOpacity>

            {/* Sign Up Link Row */}
            <View style={styles.signUpRow}>
              <Text style={[styles.noAccountText, { color: activeColors.text }]}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity 
                onPress={handleSignUp}
                accessibilityRole="button"
                accessibilityLabel="Sign Up"
              >
                <Text style={[styles.signUpText, { color: activeColors.primary }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Bottom Safe Area Padding */}
      <View style={{ height: Math.max(12, insets.bottom), backgroundColor: activeColors.surface }} />
    </View>
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
    alignSelf: 'center',
    marginBottom: 32,
  },
  formContainer: {
    gap: 20,
    alignSelf: 'stretch',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 12,
    marginBottom: 40,
  },
  forgotPasswordText: {
    ...Typography.caption2,
  },
  signInButton: {
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  fingerprintButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    height: 64,
    marginBottom: 24,
  },
  fingerprintIcon: {
    width: 64,
    height: 64,
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto', // Push to bottom of content if there is extra space
    paddingTop: 12,
  },
  noAccountText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  signUpText: {
    ...Typography.caption1,
  },
});
