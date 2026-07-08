import { Colors } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World</Text>
      <Button
        title="Sign in"
        style={styles.button}
        onPress={() => console.log('Button pressed')}
      />
      <Button
        title="Sign in"
        disabled
        style={styles.button}
        onPress={() => console.log('Disabled button pressed')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    gap: 16,
  },
  text: {
    fontFamily: 'Poppins-Medium',
    fontSize: 24,
    color: Colors.light.primary1,
  },
  button: {
    width: 267,
  },
});
