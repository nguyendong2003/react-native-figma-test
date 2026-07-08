import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
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

import { Icons } from "@/assets/icons";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { InputField } from "@/components/InputField";
import { NavigationBar } from "@/components/NavigationBar";
import { Shadows, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";

// Simple helper to convert numbers to words
function numberToWords(num: number): string {
  const ones = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  if (num === 0) return "zero";
  if (num < 0) return "minus " + numberToWords(Math.abs(num));

  let words = "";

  if (num >= 1000) {
    words += numberToWords(Math.floor(num / 1000)) + " thousand ";
    num %= 1000;
  }

  if (num >= 100) {
    words += ones[Math.floor(num / 100)] + " hundred ";
    num %= 100;
    if (num > 0) words += "and ";
  }

  if (num > 0) {
    if (num < 20) {
      words += ones[num];
    } else {
      words += tens[Math.floor(num / 10)];
      if (num % 10 > 0) {
        words += "-" + ones[num % 10];
      }
    }
  }

  return words.trim();
}

function capitalizeFirstLetter(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function TransferScreen() {
  const { theme, activeColors } = useTheme();

  // --- STATE VARIABLES ---
  const [selectedAccount, setSelectedAccount] = useState<
    "visa1234" | "master5678"
  >("visa1234");
  const [selectedMethod, setSelectedMethod] = useState<
    "card" | "same_bank" | "other_bank"
  >("other_bank");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string | null>(
    "Emma",
  );

  // Form Fields
  const [bank, setBank] = useState("Citibank");
  const [branch, setBranch] = useState("New York");
  const [name, setName] = useState("Emma");
  const [cardNumber, setCardNumber] = useState("1235 6478 990");
  const [amount, setAmount] = useState("200");
  const [amountWords, setAmountWords] = useState("Two hundred dollar");
  const [content, setContent] = useState("From Jimy");
  const [saveBeneficiary, setSaveBeneficiary] = useState(true);
  const [loading, setLoading] = useState(false);

  // --- BENEFICIARIES DATA ---
  const beneficiaries = [
    {
      name: "Emma",
      bank: "Citibank",
      branch: "New York",
      cardNumber: "1235 6478 990",
    },
    {
      name: "Justin",
      bank: "HSBC",
      branch: "London",
      cardNumber: "8899 4433 112",
    },
    {
      name: "Amanda",
      bank: "Chase",
      branch: "California",
      cardNumber: "7766 5544 332",
    },
  ];

  // Update form fields when beneficiary changes
  const handleSelectBeneficiary = (beneficiaryName: string) => {
    setSelectedBeneficiary(beneficiaryName);
    const target = beneficiaries.find((b) => b.name === beneficiaryName);
    if (target) {
      setName(target.name);
      setCardNumber(target.cardNumber);
      setBank(target.bank);
      setBranch(target.branch);
    }
  };

  // Convert amount to words dynamically
  useEffect(() => {
    const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, ""));
    if (!isNaN(numericAmount) && numericAmount > 0) {
      const words = numberToWords(Math.floor(numericAmount));
      setAmountWords(`${capitalizeFirstLetter(words)} dollar`);
    } else {
      setAmountWords("");
    }
  }, [amount]);

  // --- DROPDOWN ACTION ALERTS ---
  const handleChooseAccount = () => {
    Alert.alert(
      "Choose account/ card",
      "Select a source account for transfer:",
      [
        {
          text: "VISA **** **** **** 1234 (Bal: $10,000)",
          onPress: () => setSelectedAccount("visa1234"),
        },
        {
          text: "Mastercard **** **** **** 5678 (Bal: $5,430)",
          onPress: () => setSelectedAccount("master5678"),
        },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  const handleChooseBank = () => {
    Alert.alert("Choose Bank", "Select a destination bank:", [
      { text: "Citibank", onPress: () => setBank("Citibank") },
      { text: "HSBC", onPress: () => setBank("HSBC") },
      { text: "Chase", onPress: () => setBank("Chase") },
      { text: "Wells Fargo", onPress: () => setBank("Wells Fargo") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleChooseBranch = () => {
    Alert.alert("Choose Branch", "Select a bank branch:", [
      { text: "New York", onPress: () => setBranch("New York") },
      { text: "London", onPress: () => setBranch("London") },
      { text: "California", onPress: () => setBranch("California") },
      { text: "Tokyo", onPress: () => setBranch("Tokyo") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleAddNewBeneficiary = () => {
    Alert.prompt(
      "Add New Beneficiary",
      "Enter beneficiary name:",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: (text?: string) => {
            if (text && text.trim()) {
              Alert.alert(
                "Success",
                `Beneficiary "${text.trim()}" added to quick list.`,
              );
              setSelectedBeneficiary(text.trim());
              setName(text.trim());
              setCardNumber("");
            }
          },
        },
      ],
      "plain-text",
    );
  };

  const handleConfirm = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter or select a beneficiary name.");
      return;
    }
    if (!cardNumber.trim()) {
      Alert.alert("Error", "Please enter a valid card/account number.");
      return;
    }
    if (!amount.trim() || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid transfer amount.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Transfer Success",
        `Successfully transferred $${amount} to ${name} (${bank}).`,
        [{ text: "OK", onPress: () => router.back() }],
      );
    }, 1500);
  };

  const isDark = theme === "dark";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: activeColors.background }]}
      edges={["bottom"]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Navigation Bar */}
      <NavigationBar
        title="Transfer"
        showBackButton={true}
        showRightButton={true}
        rightIconName="search"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 24px spacing from header */}
          <View style={styles.verticalGap24} />

          {/* Choose Account Dropdown */}
          <InputField
            label="Choose account/ card"
            value={
              selectedAccount === "visa1234"
                ? "VISA **** **** **** 1234"
                : "Mastercard **** **** **** 5678"
            }
            caption={
              selectedAccount === "visa1234"
                ? "Available balance : 10,000$"
                : "Available balance : 5,430$"
            }
            onPress={handleChooseAccount}
            style={styles.accountSelector}
          />

          <View style={styles.verticalGap24} />

          {/* Choose Transaction Method Section */}
          <Text style={[styles.sectionTitle, { color: activeColors.text }]}>
            Choose transaction
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.methodsScrollView}
          >
            <Card
              variant="method"
              title={`Transfer via\ncard number`}
              iconName="creditCard"
              selected={selectedMethod === "card"}
              onPress={() => setSelectedMethod("card")}
            />
            <Card
              variant="method"
              title={`Transfer to\nthe same bank`}
              iconName="bankSame"
              selected={selectedMethod === "same_bank"}
              onPress={() => setSelectedMethod("same_bank")}
            />
            <Card
              variant="method"
              title={`Transfer to\nanother bank`}
              iconName="bankOther"
              selected={selectedMethod === "other_bank"}
              onPress={() => setSelectedMethod("other_bank")}
            />
          </ScrollView>

          <View style={styles.verticalGap32} />

          {/* Choose Beneficiary Section Header */}
          <View style={styles.beneficiaryHeaderRow}>
            <Text style={[styles.sectionTitle, { color: activeColors.text }]}>
              Choose beneficiary
            </Text>
            <TouchableOpacity onPress={handleAddNewBeneficiary}>
              <Text
                style={[
                  styles.findBeneficiaryText,
                  { color: activeColors.textMuted },
                ]}
              >
                Find beneficiary
              </Text>
            </TouchableOpacity>
          </View>

          {/* Beneficiary Horizontal List */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.beneficiaryScrollView}
          >
            <Card
              variant="beneficiary"
              isAddNew
              onPress={handleAddNewBeneficiary}
            />
            {beneficiaries.map((b) => (
              <Card
                key={b.name}
                variant="beneficiary"
                name={b.name}
                selected={selectedBeneficiary === b.name}
                onPress={() => handleSelectBeneficiary(b.name)}
              />
            ))}
          </ScrollView>

          <View style={styles.verticalGap32} />

          {/* Details Card Form (Rectangle 414) */}
          <View
            style={[styles.formCard, { backgroundColor: activeColors.surface }]}
          >
            {/* Choose Bank Dropdown */}
            <InputField
              label="Choose bank"
              value={bank}
              onPress={handleChooseBank}
            />

            {/* Choose Branch Dropdown */}
            <InputField
              label="Choose branch"
              value={branch}
              onPress={handleChooseBranch}
            />

            {/* Name Input */}
            <InputField
              label="Name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setSelectedBeneficiary(null); // Deselect quick beneficiary since name is customized
              }}
              placeholder="Enter name"
            />

            {/* Card Number Input */}
            <InputField
              label="Card number"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
              placeholder="Enter card number"
            />

            {/* Amount Input */}
            <InputField
              label="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
              caption={amountWords}
            />

            {/* Content Input */}
            <InputField
              label="Content"
              value={content}
              onChangeText={setContent}
              placeholder="Enter transfer content"
            />

            <View style={styles.formBottomSpacing} />

            {/* Checkbox Save Beneficiary */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setSaveBeneficiary(!saveBeneficiary)}
              activeOpacity={0.8}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: saveBeneficiary }}
            >
              <View
                style={[
                  styles.checkboxBox,
                  {
                    borderColor: saveBeneficiary
                      ? activeColors.primary
                      : activeColors.border,
                  },
                ]}
              >
                {saveBeneficiary && (
                  <Image
                    source={Icons.check}
                    style={styles.checkboxCheckIcon}
                    tintColor={activeColors.primary}
                    contentFit="contain"
                  />
                )}
              </View>
              <Text
                style={[styles.checkboxLabel, { color: activeColors.text }]}
              >
                Save to directory of beneficiary
              </Text>
            </TouchableOpacity>

            <View style={styles.verticalGap40} />

            {/* Confirm Button */}
            <Button
              title="Confirm"
              loading={loading}
              onPress={handleConfirm}
              style={styles.confirmButton}
            />
          </View>

          {/* Spacing for keyboard and scroll buffer */}
          <View style={styles.scrollFooterSpacing} />
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
  verticalGap24: {
    height: 24,
  },
  verticalGap32: {
    height: 32,
  },
  verticalGap40: {
    height: 40,
  },
  accountSelector: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    ...Typography.title3,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  methodsScrollView: {
    paddingHorizontal: 24,
    gap: 16,
  },
  beneficiaryHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  findBeneficiaryText: {
    ...Typography.caption2,
    paddingHorizontal: 24,
  },
  beneficiaryScrollView: {
    paddingHorizontal: 24,
    gap: 12,
  },
  formCard: {
    marginHorizontal: 24,
    borderRadius: 30,
    paddingVertical: 24,
    paddingHorizontal: 16,
    ...Shadows.card1,
  },
  formBottomSpacing: {
    height: 20,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    gap: 12,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxCheckIcon: {
    width: 16,
    height: 16,
  },
  checkboxLabel: {
    ...Typography.body3,
    fontSize: 12,
  },
  confirmButton: {
    alignSelf: "stretch",
  },
  scrollFooterSpacing: {
    height: 60,
  },
});
