import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Typography } from '@/constants/theme';
import { Icons } from '@/assets/icons';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/Button';
import { NavigationBar } from '@/components/NavigationBar';

export default function SignInScreen() {
  const router = useRouter();
  const { activeColors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    if (!email || !password) return;
    setLoading(true);
    // Mock authentication
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Logged in successfully!');
      router.replace('/');
    }, 1500);
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password recovery link has been sent to your email.');
  };

  const handleBiometrics = () => {
    Alert.alert('Biometrics', 'Scanning fingerprint/face...');
  };

  const isFormValid = email.trim().length > 0 && password.trim().length > 0;

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: activeColors.primary }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar barStyle="light-content" backgroundColor={activeColors.primary} />
      {/* Premium Header */}
      <NavigationBar
        title="Sign in"
        tintColor="#ffffff"
        style={styles.header}
        onBackPress={() => router.back()}
      />

      {/* Main Card Sheet */}
      <View
        style={[
          styles.sheetContainer,
          { backgroundColor: activeColors.background },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Welcome Text */}
          <Text style={[styles.title, { color: activeColors.primary }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: activeColors.textMuted }]}>
            Hello there, sign in to continue
          </Text>

          {/* Custom Illustration Asset */}
          <Image
            source={Icons.signinIllustration}
            style={styles.illustration}
            contentFit="contain"
          />

          {/* Form Fields */}
          <InputField
            placeholder="Text input"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.emailInput}
          />

          <InputField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            containerStyle={styles.passwordInput}
          />

          {/* Forgot Password */}
          <Pressable
            onPress={handleForgotPassword}
            style={({ pressed }) => [
              styles.forgotPasswordPressable,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.forgotPasswordText,
                { color: activeColors.placeholder },
              ]}
            >
              Forgot your password ?
            </Text>
          </Pressable>

          {/* Sign In Button */}
          <Button
            title="Sign in"
            variant="primary"
            loading={loading}
            disabled={!isFormValid}
            onPress={handleSignIn}
            style={styles.signInButton}
          />

          {/* Biometric Button */}
          <Pressable
            onPress={handleBiometrics}
            style={({ pressed }) => [
              styles.biometricButton,
              pressed && styles.pressed,
            ]}
          >
            <Image
              source={Icons.fingerprint}
              style={styles.biometricIcon}
              tintColor={activeColors.primary}
              contentFit="contain"
            />
          </Pressable>

          {/* Footer Navigation */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: activeColors.textMuted }]}>
              Don't have an account?{' '}
            </Text>
            <Button
              title="Sign Up"
              variant="link"
              onPress={() => router.push('/signup')}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    backgroundColor: 'transparent',
    marginBottom: 15,
  },
  sheetContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  title: {
    ...Typography.title1,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginBottom: 32,
  },
  illustration: {
    width: 213,
    height: 165,
    alignSelf: 'center',
    marginBottom: 32,
  },
  emailInput: {
    marginBottom: 20,
  },
  passwordInput: {
    marginBottom: 12,
  },
  forgotPasswordPressable: {
    alignSelf: 'flex-end',
    marginBottom: 40,
  },
  forgotPasswordText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  signInButton: {
    marginBottom: 24,
  },
  biometricButton: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  biometricIcon: {
    width: 64,
    height: 64,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  footerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
  pressed: {
    opacity: 0.7,
  },
});
