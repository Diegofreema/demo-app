import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button, TextInput } from 'react-native-paper';
import { useAuth } from '@/hooks/zustand/useAuth';
import { router } from 'expo-router';
import { registerIndieID } from 'native-notify';
type Props = {};

const Login = (props: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secured, setSecured] = useState(true);
  const { setLoggedIn, path } = useAuth();
  const isValidCredentials = username === 'SoftAmos' && password === 'SoftAmos';

  const onLogin = () => {
    if (username.trim().length === 0 || password.trim().length === 0) {
      alert('Please enter both username and password');
      return;
    }
    if (isValidCredentials) {
      registerIndieID('1', 21568, 'FvrVNFvFuzAotOM6CmeXfz');
      setLoggedIn();
      router.replace('/cart');
    } else {
      alert('Invalid credentials');
    }
  };
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 20,
      }}
    >
      <ThemedText>Login in</ThemedText>
      <ThemedText>to continue</ThemedText>
      <TextInput
        style={{ width: '100%' }}
        mode="outlined"
        placeholder="User name"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={{ width: '100%' }}
        mode="outlined"
        placeholder="Password"
        secureTextEntry={secured}
        value={password}
        onChangeText={setPassword}
        right={
          <TextInput.Icon
            icon={secured ? 'eye' : 'eye-off'}
            onPress={() => setSecured(!secured)}
          />
        }
      />
      <Button
        buttonColor="green"
        textColor="white"
        style={{ width: '100%', marginHorizontal: 20 }}
        onPress={onLogin}
      >
        Submit
      </Button>
    </ThemedView>
  );
};

export default Login;

const styles = StyleSheet.create({});
