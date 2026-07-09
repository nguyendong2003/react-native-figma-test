import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Typography } from '@/constants/theme';
import { Icons } from '@/assets/icons';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { NavigationBar } from '@/components/NavigationBar';

export default function SignUpScreen() {
  const router = useRouter();
  const { activeColors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    if (!name || !email || !password || !agree) return;
    setLoading(true);
    // Mock registration
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Account created successfully!');
      router.replace('/signin');
    }, 1500);
  };

  const isFormValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    agree;

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: activeColors.primary }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar barStyle="light-content" backgroundColor={activeColors.primary} />
      
      {/* Premium Header */}
      <NavigationBar
        title="Sign up"
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
            Welcome to us,
          </Text>
          <Text style={[styles.subtitle, { color: activeColors.textMuted }]}>
            Hello there, create New account
          </Text>

          {/* Custom Illustration Asset */}
          <Image
            source={Icons.signupIllustration}
            style={styles.illustration}
            contentFit="contain"
          />

          {/* Form Fields */}
          <InputField
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            containerStyle={styles.nameInput}
          />

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

          {/* Terms Agreement Checkbox */}
          <Checkbox
            label={`By creating an account your agree\nto our  Term and Condtions`}
            checked={agree}
            onChange={setAgree}
            style={styles.termsCheckbox}
          />

          {/* Action Button */}
          <Button
            title="Sign up"
            variant="primary"
            loading={loading}
            disabled={!isFormValid}
            onPress={handleSignUp}
            style={styles.signUpButton}
          />

          {/* Footer Navigation */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: activeColors.textMuted }]}>
              Have an account?{' '}
            </Text>
            <Button
              title="Sign In"
              variant="link"
              onPress={() => router.push('/signin')}
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
  nameInput: {
    marginBottom: 20,
  },
  emailInput: {
    marginBottom: 20,
  },
  passwordInput: {
    marginBottom: 20,
  },
  termsCheckbox: {
    marginBottom: 32,
  },
  signUpButton: {
    marginBottom: 32,
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
});
