import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Typography } from '@/constants/theme';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/Button';
import { NavigationBar } from '@/components/NavigationBar';

export default function TransferConfirmScreen() {
  const router = useRouter();
  const { activeColors, isDarkMode } = useTheme();

  // Mock static values from Figma
  const [fromAccount] = useState('**** **** 6789');
  const [toAccount] = useState('Amanda');
  const [beneficiaryBank] = useState('US bank');
  const [cardNumber] = useState('0123456789');
  const [transactionFee] = useState('10$');
  const [note] = useState('From Jimy');
  const [amount] = useState('$1000');

  // Input state
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  const handleGetOTP = () => {
    Alert.alert('OTP Sent', 'A verification code has been sent to your phone.');
    setOtpCountdown(60);
    const interval = setInterval(() => {
      setOtpCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleConfirm = () => {
    if (!otp.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Transaction Successful', 'Your transfer has been successfully processed!');
      router.replace('/');
    }, 1500);
  };

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: activeColors.background }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={activeColors.background}
      />

      {/* Navigation Bar */}
      <NavigationBar
        title="Confirm"
        onBackPress={() => router.back()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Description Header */}
        <Text style={[styles.description, { color: activeColors.textMuted }]}>
          Confirm transaction information
        </Text>

        {/* Labeled Information Fields */}
        <InputField
          label="From"
          value={fromAccount}
          editable={false}
          containerStyle={styles.infoField}
        />

        <InputField
          label="To"
          value={toAccount}
          editable={false}
          containerStyle={styles.infoField}
        />

        <InputField
          label="Beneficiary bank"
          value={beneficiaryBank}
          editable={false}
          containerStyle={styles.infoField}
        />

        <InputField
          label="Card number"
          value={cardNumber}
          editable={false}
          containerStyle={styles.infoField}
        />

        <InputField
          label="Transaction fee"
          value={transactionFee}
          editable={false}
          containerStyle={styles.infoField}
        />

        <InputField
          label="Note"
          value={note}
          editable={false}
          containerStyle={styles.infoField}
        />

        <InputField
          label="Amount"
          value={amount}
          editable={false}
          containerStyle={styles.infoField}
        />

        {/* OTP Verification Box */}
        <Text style={[styles.otpLabel, { color: activeColors.textMuted }]}>
          Get OTP to verify transaction
        </Text>
        <View style={styles.otpRow}>
          <InputField
            placeholder="OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            containerStyle={styles.otpInputContainer}
          />
          <Button
            title={otpCountdown > 0 ? `${otpCountdown}s` : 'Get OTP'}
            variant="secondary"
            disabled={otpCountdown > 0}
            onPress={handleGetOTP}
            style={styles.otpButton}
          />
        </View>

        {/* Confirm Transaction Trigger */}
        <Button
          title="Confirm"
          variant="primary"
          loading={loading}
          disabled={!otp.trim()}
          onPress={handleConfirm}
          style={styles.confirmButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  description: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginBottom: 28,
  },
  infoField: {
    marginBottom: 24,
  },
  otpLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginTop: 24,
    marginBottom: 8,
  },
  otpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  otpInputContainer: {
    flex: 1,
    marginBottom: 0, // Override default margin bottom
  },
  otpButton: {
    marginLeft: 13,
    width: 100,
    height: 44,
    borderRadius: 15,
  },
  confirmButton: {
    marginTop: 12,
    marginBottom: 24,
  },
});
