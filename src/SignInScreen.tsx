import React, {useEffect, useState} from 'react';
import {Alert, Image, SafeAreaView, StyleSheet, Text, TextInput} from 'react-native';

import {Button, GoogleButton} from './Button';
import {authsignal} from './authsignal';
import {initiateSmsAuth, handlePasskeyAuth, handleGoogleAuth} from './cognito';
import {ErrorCode} from 'react-native-authsignal';
import {useAppContext} from './context';
import {signInWithGoogle} from './google';
import {startSignIn} from './api';

export function SignInScreen({navigation}: any) {
  const {setUserAttributes} = useAppContext();

  const [phoneNumber, setPhoneNumber] = useState('+64');

  useEffect(() => {
    async function signInWithPasskey() {
      const {data, errorCode} = await authsignal.passkey.signIn({action: 'cognitoAuth'});

      if (errorCode === ErrorCode.user_canceled || errorCode === ErrorCode.no_credential || !data) {
        return;
      }

      try {
        await handlePasskeyAuth(data);

        await setUserAttributes();
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert('Error', error.message);
        }
      }
    }

    signInWithPasskey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPressContinue = async () => {
    try {
      const {username} = await startSignIn({phoneNumber});

      if (!username) {
        throw new Error('startSignIn error');
      }

      const {session, token, phoneNumberVerified} = await initiateSmsAuth(username);

      if (!token) {
        throw new Error('No Authsignal token returned from Create Auth Challenge lambda');
      }

      await authsignal.setToken(token);

      navigation.navigate('SignInModal', {username, phoneNumber, phoneNumberVerified, session});
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert('Invalid credentials', err.message);
      }
    }
  };

  const onPressContinueWithGoogle = async () => {
    try {
      const {idToken} = await signInWithGoogle();

      const {username} = await startSignIn({googleIdToken: idToken});

      if (!username) {
        throw new Error('startSignIn error');
      }

      await handleGoogleAuth({username, idToken});

      const {phoneNumberVerified, givenName, familyName} = await setUserAttributes();

      if (!phoneNumberVerified || !givenName || !familyName) {
        navigation.navigate('SignInModal', {username, phoneNumberVerified, givenName, familyName});
      }
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert('Error', err.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../images/simplify.png')} resizeMode={'contain'} style={styles.logo} />
      <Text style={styles.header}>Get started with Simplify</Text>
      <Text style={styles.text}>Mobile number</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone number"
        onChangeText={setPhoneNumber}
        value={phoneNumber}
        autoCapitalize={'none'}
        autoCorrect={false}
        autoFocus={true}
        textContentType={'telephoneNumber'}
      />
      <Button onPress={onPressContinue}>Continue</Button>
      <Text style={styles.or}>OR</Text>
      <GoogleButton onPress={onPressContinueWithGoogle} />
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
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    height: 50,
    borderColor: 'black',
    borderRadius: 6,
    borderWidth: 1,
    padding: 10,
  },
  header: {
    alignSelf: 'flex-start',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  text: {
    alignSelf: 'flex-start',
    marginHorizontal: 20,
  },
  logo: {
    width: '100%',
    marginBottom: 20,
  },
  or: {
    marginBottom: 20,
  },
});
