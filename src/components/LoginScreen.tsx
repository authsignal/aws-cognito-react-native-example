import {
  confirmSignIn,
  signIn,
  SignInInput,
  signUp,
  SignUpInput,
} from 'aws-amplify/auth';
import React, {useState} from 'react';
import {
  Alert,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import {Authsignal} from 'react-native-authsignal';

import {Button} from './Button';

const authsignalArgs = {
  tenantID: '921212c3-07e6-4666-a9fe-371cdeb106bc',
  baseURL: 'https://dev-api.authsignal.com/v1', // Change for your region if required
};

const authsignal = new Authsignal(authsignalArgs);

export function LoginScreen({navigation}: any) {
  const [userName, setUserName] = useState('');

  const onPressSignUp = async () => {
    const signUpInput: SignUpInput = {
      username: userName,
      password: Math.random().toString(36).slice(-16) + 'X', // Dummy value - never used
    };

    try {
      await signUp(signUpInput);
    } catch (ex) {
      return ex instanceof Error ? Alert.alert(ex.message) : undefined;
    }

    const signInInput: SignInInput = {
      username: userName,
      options: {
        authFlowType: 'CUSTOM_WITHOUT_SRP',
      },
    };

    const {nextStep} = await signIn(signInInput);

    if (nextStep.signInStep !== 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE') {
      return Alert.alert('Invalid sign-in step');
    }

    const token = nextStep.additionalInfo!.token;

    const {data, error} = await authsignal.passkey.signUp({token, userName});

    if (error || !data) {
      return Alert.alert(error?.length ? error : 'Unexpected error signing up');
    }

    await confirmSignIn({challengeResponse: data});

    navigation.navigate('Home');
  };

  const onPressSignIn = async () => {
    const {data, error} = await authsignal.passkey.signIn({
      action: 'cognitoAuth',
    });

    if (error || !data) {
      return Alert.alert(error ?? 'Unexpected error signing in');
    }

    const signInInput: SignInInput = {
      username: userName,
      options: {
        authFlowType: 'CUSTOM_WITHOUT_SRP',
      },
    };

    const {nextStep} = await signIn(signInInput);

    if (nextStep.signInStep !== 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE') {
      return Alert.alert('Invalid sign-in step');
    }

    await confirmSignIn({challengeResponse: data});

    navigation.navigate('Home');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="username"
          onChangeText={setUserName}
          value={userName}
          autoCapitalize={'none'}
          autoCorrect={false}
          autoFocus={false}
          textContentType={'username'}
        />
        <Button onPress={onPressSignUp}>Sign up</Button>
        <Text>Or</Text>
        <Button onPress={onPressSignIn}>Sign in</Button>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  input: {
    alignSelf: 'stretch',
    margin: 20,
    height: 50,
    borderColor: 'black',
    borderRadius: 6,
    borderWidth: 1,
    padding: 10,
  },
});
