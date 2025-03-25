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
import {authsignal} from './config';
import {useAuthContext} from './context';

export function VerifyEmailScreen({route}: any) {
  const {setIsSignedIn} = useAuthContext();

  const [code, setCode] = useState('');

  const {email, isEnrolled} = route.params;

  const sendEmail = useCallback(async () => {
    if (isEnrolled) {
      await authsignal.email.challenge();
    } else {
      await authsignal.email.enroll({email});
    }
  }, [email, isEnrolled]);

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
          const {data, error} = await authsignal.email.verify({code});

          if (error || !data?.token) {
            Alert.alert('Invalid code');
          } else {
            const {isSignedIn} = await confirmSignIn({
              challengeResponse: data.token,
            });

            setIsSignedIn(isSignedIn);
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
