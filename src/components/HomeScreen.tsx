import {getCurrentUser, AuthUser, signOut} from 'aws-amplify/auth';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

import {Button} from './Button';

export function HomeScreen({navigation}: any) {
  const [user, setUser] = useState<AuthUser | undefined>();

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Signed in</Text>
      {user && (
        <Text style={styles.text}>{`Cognito user ID:\n\n ${user.userId}`}</Text>
      )}
      <View style={styles.buttonContainer}>
        <Button
          onPress={async () => {
            await signOut();

            navigation.navigate('Login');
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
  text: {
    marginVertical: 20,
    color: 'black',
    fontSize: 12,
  },
  buttonContainer: {
    width: '100%',
  },
});
