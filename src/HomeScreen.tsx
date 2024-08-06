import {signOut} from 'aws-amplify/auth';
import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

import {Button} from './Button';
import {useAuthContext} from './context';
import {authsignal} from './config';

export function HomeScreen() {
  const {authsignalToken, setIsSignedIn, setAuthsignalToken} = useAuthContext();

  useEffect(() => {
    if (authsignalToken) {
      authsignal.passkey.signUp({token: authsignalToken});

      setAuthsignalToken(null);
    }
  }, [authsignalToken, setAuthsignalToken]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Signed in</Text>
      <View style={styles.buttonContainer}>
        <Button
          onPress={async () => {
            await signOut();

            setIsSignedIn(false);
          }}>
          Sign out
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 20,
  },
  header: {
    marginVertical: 20,
    color: 'black',
    fontSize: 32,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
  },
});
