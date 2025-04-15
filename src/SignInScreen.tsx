import React, {useEffect, useState} from 'react';
import {Alert, Image, SafeAreaView, StyleSheet, Text, TextInput} from 'react-native';

import {Button} from './Button';
import {authsignal} from './authsignal';
import {signUp, initiateAuth, respondToAuthChallenge, getUserAttributes} from './cognito';
import {ErrorCode} from 'react-native-authsignal';
import {useAppContext} from './context';

export function SignInScreen({navigation}: any) {
  const {setUsername, setVerifiedEmail, setNames} = useAppContext();

  const [phoneNumber, setPhoneNumber] = useState('+64');

  useEffect(() => {
    async function signInWithPasskey() {
      const {data, errorCode} = await authsignal.passkey.signIn({
        action: 'cognitoAuth',
      });

      if (errorCode === ErrorCode.user_canceled || errorCode === ErrorCode.no_credential) {
        return;
      }

      if (!data || !data.token || !data.username) {
        return;
      }

      const {username} = data;

      try {
        const {session} = await initiateAuth(username);

        await respondToAuthChallenge({session, username, answer: data.token});

        const attrs = await getUserAttributes();

        if (attrs.email && attrs.emailVerified) {
          setVerifiedEmail(attrs.email);
        }

        if (attrs.givenName && attrs.familyName) {
          setNames(attrs.givenName, attrs.familyName);
        }

        setUsername(attrs.username);
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert('Error', error.message);
        }
      }
    }

    signInWithPasskey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <Button
        onPress={async () => {
          const username = phoneNumber;

          // Sign up user in Cognito
          // If they already exist then ignore error and continue
          try {
            await signUp({username, phoneNumber});
          } catch (ex) {
            if (ex instanceof Error && ex.name !== 'UsernameExistsException') {
              return Alert.alert('Error', ex.message);
            }
          }

          // Start custom auth sign-in flow
          // This will invoke the Create Auth Challenge lambda
          try {
            const {session, token, isEnrolled} = await initiateAuth(username);

            if (!token) {
              throw new Error('No Authsignal token returned from Create Auth Challenge lambda');
            }

            await authsignal.setToken(token);

            navigation.navigate('VerifySms', {phoneNumber, isEnrolled, session});
          } catch (err) {
            if (err instanceof Error) {
              Alert.alert('Invalid credentials', err.message);
            }
          }
        }}>
        Continue
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
});
