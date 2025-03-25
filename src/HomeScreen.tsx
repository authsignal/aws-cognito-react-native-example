import {signOut} from 'aws-amplify/auth';
import React, {useEffect} from 'react';
import {Alert, SafeAreaView, StyleSheet, Text, View} from 'react-native';

import {Button} from './Button';
import {authsignal} from './config';
import {useAuthContext} from './context';

export function HomeScreen() {
  const {setIsSignedIn} = useAuthContext();

  useEffect(() => {
    (async () => {
      // True if a passkey has been previously created on this device with the SDK
      const isPasskeyAvailable = await authsignal.passkey.isAvailableOnDevice();

      if (!isPasskeyAvailable) {
        try {
          await authsignal.passkey.signUp();

          Alert.alert('Passkey created.');
        } catch (ex) {
          if (ex instanceof Error) {
            Alert.alert('Error: ', ex.message);
          }
        }
      }
    })();
  }, []);

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
