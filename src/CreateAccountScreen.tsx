import {signIn, SignInInput, signUp, SignUpInput} from 'aws-amplify/auth';
import React, {useState} from 'react';
import {Alert, SafeAreaView, StyleSheet, TextInput} from 'react-native';

import {Button} from './Button';
import {authsignal} from './config';

export function CreateAccountScreen({navigation}: any) {
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
          try {
            const signUpInput: SignUpInput = {
              username: email,
              password: Math.random().toString(36).slice(-16) + 'X', // Dummy value - never used
              options: {
                userAttributes: {
                  email,
                },
              },
            };

            await signUp(signUpInput);
          } catch (ex) {
            if (ex instanceof Error) {
              return Alert.alert('Error creating account', ex.message);
            } else {
              return;
            }
          }

          const signInInput: SignInInput = {
            username: email,
            options: {
              authFlowType: 'CUSTOM_WITHOUT_SRP',
            },
          };

          const {nextStep} = await signIn(signInInput);

          if (nextStep.signInStep !== 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE') {
            return;
          }

          const token = nextStep.additionalInfo!.token;
          const isEnrolled = nextStep.additionalInfo!.isEnrolled === 'true';

          await authsignal.setToken(token);

          navigation.navigate('VerifyEmail', {email, isEnrolled});
        }}>
        Create account
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
