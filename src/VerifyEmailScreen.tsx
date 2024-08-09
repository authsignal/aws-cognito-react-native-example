import {confirmSignIn} from 'aws-amplify/auth';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import {Button} from './Button';
import {baseURL} from './config';
import {useAuthContext} from './context';

export function VerifyEmailScreen({route}: any) {
  const {setIsSignedIn, setAuthsignalToken} = useAuthContext();

  const [code, setCode] = useState('');

  const {token, isEnrolled} = route.params;

  const sendEmail = useCallback(async () => {
    if (isEnrolled === 'true') {
      await startEmailOtpChallenge(token);
    } else {
      await startEmailOtpEnrollment(token);
    }
  }, [token, isEnrolled]);

  useEffect(() => {
    sendEmail();
  }, [sendEmail]);

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter verification code"
        onChangeText={setCode}
        value={code}
        autoFocus={true}
        keyboardType={'number-pad'}
      />
      <Button
        onPress={async () => {
          try {
            const {accessToken} = await verifyEmailOtpChallenge(token, code);

            const {isSignedIn} = await confirmSignIn({
              challengeResponse: accessToken,
            });

            setIsSignedIn(isSignedIn);
            setAuthsignalToken(accessToken);
          } catch {
            Alert.alert('Invalid code');
          }
        }}>
        Verify
      </Button>
      <TouchableOpacity
        onPress={async () => {
          setCode('');

          await sendEmail();

          Alert.alert('Verification code re-sent');
        }}>
        <Text style={styles.link}>Re-send code</Text>
      </TouchableOpacity>
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
  link: {
    color: '#525EEA',
    fontSize: 14,
  },
});

async function startEmailOtpEnrollment(token: string) {
  return post('/client/user-authenticators/email-otp', token);
}

async function startEmailOtpChallenge(token: string) {
  return post('/client/challenge/email-otp', token);
}

async function verifyEmailOtpChallenge(
  token: string,
  verificationCode: string,
) {
  return post('/client/verify/email-otp', token, {verificationCode});
}

async function post(path: string, token: string, body: any = {}) {
  const response = await fetch(`${baseURL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    method: 'POST',
    body: JSON.stringify(body),
  });

  const json = await await response.json();

  if (response.status !== 200) {
    console.log(json);
  }

  return json;
}
