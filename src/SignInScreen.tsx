import {confirmSignIn, signIn} from 'aws-amplify/auth';
import React from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import {ErrorCode} from 'react-native-authsignal';

import {Button} from './Button';
import {authsignal} from './config';
import {useAuthContext} from './context';

export function SignInScreen({navigation}: any) {
  const {setIsSignedIn} = useAuthContext();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Image
          source={require('../images/simplify.png')}
          resizeMode={'contain'}
          style={styles.logo}
        />
        <Button
          onPress={async () => {
            const {data, errorCode} = await authsignal.passkey.signIn({
              action: 'cognitoAuth',
            });

            if (
              errorCode === ErrorCode.passkeySignInCanceled ||
              errorCode === ErrorCode.noPasskeyCredentialAvailable
            ) {
              return navigation.navigate('SignInEmailStack');
            }

            if (data?.username && data?.token) {
              await signIn({
                username: data.username,
                options: {
                  authFlowType: 'CUSTOM_WITHOUT_SRP',
                },
              });

              const {isSignedIn} = await confirmSignIn({
                challengeResponse: data.token,
              });

              setIsSignedIn(isSignedIn);
            }
          }}>
          Sign in
        </Button>
        <Button
          theme={'secondary'}
          onPress={() => navigation.navigate('CreateAccountStack')}>
          Create account
        </Button>
      </View>
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
  center: {
    width: '100%',
  },
  logo: {
    width: '100%',
  },
});
