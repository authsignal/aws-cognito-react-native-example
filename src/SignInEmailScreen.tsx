import {signIn, SignInInput} from 'aws-amplify/auth';
import React, {useState} from 'react';
import {Alert, SafeAreaView, StyleSheet, TextInput} from 'react-native';

import {Button} from './Button';
import {authsignal} from './config';

export function SignInEmailScreen({navigation}: any) {
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="email"
        onChangeText={setEmail}
        value={email}
        autoCapitalize={'none'}
        autoCorrect={false}
        autoFocus={true}
        textContentType={'emailAddress'}
      />
      <Button
        onPress={async () => {
          const signInInput: SignInInput = {
            username: email,
            options: {
              authFlowType: 'CUSTOM_WITHOUT_SRP',
            },
          };

          try {
            const {nextStep} = await signIn(signInInput);

            if (
              nextStep.signInStep !== 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE'
            ) {
              return;
            }

            const token = nextStep.additionalInfo!.token;
            const isEnrolled = nextStep.additionalInfo!.isEnrolled === 'true';

            await authsignal.setToken(token);

            navigation.navigate('VerifyEmail', {email, isEnrolled});
          } catch {
            Alert.alert('Invalid credentials');
          }
        }}>
        Sign in
      </Button>
    </SafeAreaView>
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
