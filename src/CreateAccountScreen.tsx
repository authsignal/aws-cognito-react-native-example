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
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import {launch} from 'react-native-authsignal';

import {Button} from './Button';
import {useAuthContext} from './context';

export function CreateAccountScreen() {
  const {setIsSignedIn, setAuthsignalToken} = useAuthContext();

  const [email, setEmail] = useState('');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="email"
          onChangeText={setEmail}
          value={email}
          autoCapitalize={'none'}
          autoCorrect={false}
          autoFocus={false}
          textContentType={'username'}
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

            if (
              nextStep.signInStep !== 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE'
            ) {
              return;
            }

            const url = nextStep.additionalInfo!.url;

            const token = await launch(url);

            if (!token) {
              return Alert.alert('Account already exists');
            }

            const {isSignedIn} = await confirmSignIn({
              challengeResponse: token,
            });

            if (!isSignedIn) {
              return;
            }

            setIsSignedIn(true);
            setAuthsignalToken(token);
          }}>
          Create account
        </Button>
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
