import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/Button';
import { NavigationBar } from '@/components/NavigationBar';
import { Checkbox } from '@/components/Checkbox';

export default function HomeScreen() {
  const router = useRouter();
  const { isDarkMode, toggleTheme, activeColors } = useTheme();
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bank, setBank] = useState('');
  const [errorInput, setErrorInput] = useState('invalid_value');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('VND');

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: activeColors.background }]}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={activeColors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.header, { color: activeColors.text }]}>
          Component Previews
        </Text>

        <Text style={[styles.sectionTitle, { color: activeColors.text }]}>
          Screens
        </Text>
        <View style={{ gap: 12, marginBottom: 8 }}>
          <Button
            title="Go to Sign In Screen"
            variant="primary"
            onPress={() => router.push('/signin')}
          />
          <Button
            title="Go to Sign Up Screen"
            variant="primary"
            onPress={() => router.push('/signup')}
          />
          <Button
            title="Go to Transfer Confirm Screen"
            variant="primary"
            onPress={() => router.push('/transfer-confirm')}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: activeColors.text }]}>
          Navigation Bars
        </Text>
        <View style={{ gap: 12, marginBottom: 16 }}>
          <NavigationBar
            title="Sign in"
            onBackPress={() => alert('Back pressed')}
            style={{ borderRadius: 12, borderWidth: 1, borderColor: activeColors.border }}
          />
          <NavigationBar
            title="Explore"
            showBackButton={false}
            rightIcon="search"
            onRightIconPress={() => alert('Search pressed')}
            style={{ borderRadius: 12, borderWidth: 1, borderColor: activeColors.border }}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: activeColors.text }]}>
          Checkboxes
        </Text>
        <View style={{ gap: 16, marginBottom: 24, paddingHorizontal: 4 }}>
          <Checkbox
            label="Unchecked Box"
            checked={check1}
            onChange={setCheck1}
          />
          <Checkbox
            label="Checked Box"
            checked={check2}
            onChange={setCheck2}
          />
          <Checkbox
            label="Disabled Unchecked Box"
            checked={false}
            onChange={() => {}}
            disabled
          />
          <Checkbox
            label="Disabled Checked Box"
            checked={true}
            onChange={() => {}}
            disabled
          />
        </View>

        <View style={styles.demoSection}>
          {/* Normal Input */}
          <InputField
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Secure Input (Password) */}
          <InputField
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Select Input (Dropdown) */}
          <InputField
            label="Bank"
            placeholder="Select a bank"
            value={bank}
            onChangeText={setBank}
            rightIcon="unfoldMore"
            onRightIconPress={() => alert('Open bank selector modal')}
          />

          {/* Exchange Input (From) */}
          <InputField
            variant="exchange"
            label="From"
            placeholder="0.00"
            value={fromAmount}
            onChangeText={setFromAmount}
            keyboardType="numeric"
            currencyCode={fromCurrency}
            onCurrencyPress={() => {
              const next = fromCurrency === 'USD' ? 'EUR' : 'USD';
              setFromCurrency(next);
            }}
          />

          {/* Exchange Input (To) */}
          <InputField
            variant="exchange"
            label="To"
            placeholder="0.00"
            value={toAmount}
            onChangeText={setToAmount}
            keyboardType="numeric"
            currencyCode={toCurrency}
            onCurrencyPress={() => {
              const next = toCurrency === 'VND' ? 'EUR' : 'VND';
              setToCurrency(next);
            }}
          />

          {/* Error Input */}
          <InputField
            label="Username"
            placeholder="Enter username"
            value={errorInput}
            onChangeText={setErrorInput}
            error="This username is already taken"
          />
        </View>

        <Text style={[styles.sectionTitle, { color: activeColors.text }]}>
          Buttons
        </Text>

        <View style={styles.buttonDemoSection}>
          <Button title="Primary Button" variant="primary" onPress={() => alert('Primary Pressed')} />
          <Button title="Secondary Button" variant="secondary" onPress={() => alert('Secondary Pressed')} />
          <Button title="Outline Button" variant="outline" onPress={() => alert('Outline Pressed')} />
          <Button title="Text Button" variant="text" onPress={() => alert('Text Pressed')} />
          <Button title="Ghost Button" variant="ghost" onPress={() => alert('Ghost Pressed')} />
          <Button title="Disabled Ghost Button" variant="ghost" disabled />
          <View style={styles.rowDemo}>
            <Button variant="round" onPress={() => alert('Round Pressed')} />
            <Button variant="round" icon="check" onPress={() => alert('Check Pressed')} />
            <Button variant="round" disabled />
          </View>
          <Button title="Link Button" variant="link" onPress={() => alert('Link Pressed')} />
          <Button title="Loading Button" variant="primary" loading />
          <Button title="Disabled Button" variant="primary" disabled />
        </View>

        <View style={[styles.toggleContainer, { borderColor: activeColors.border }]}>
          <Text style={[styles.toggleText, { color: activeColors.text }]}>
            Dark Mode
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: activeColors.primary }}
            thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 24,
  },
  header: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  demoSection: {
    gap: 20,
    marginBottom: 16,
  },
  buttonDemoSection: {
    gap: 12,
  },
  rowDemo: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 24,
    borderTopWidth: 1,
    marginTop: 16,
    gap: 12,
  },
  toggleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    flex: 1,
  },
});
