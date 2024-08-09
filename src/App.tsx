import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Amplify} from 'aws-amplify';
import {getCurrentUser} from 'aws-amplify/auth';
import React, {useEffect, useMemo, useState} from 'react';

import {CreateAccountScreen} from './CreateAccountScreen';
import {HomeScreen} from './HomeScreen';
import {SignInScreen} from './SignInScreen';
import {SignInEmailScreen} from './SignInEmailScreen';
import {VerifyEmailScreen} from './VerifyEmailScreen';
import {userPoolClientId, userPoolId} from './config';
import {AuthContext} from './context';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
    },
  },
});

const Stack = createStackNavigator();

function App() {
  const [initialized, setInitialized] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authsignalToken, setAuthsignalToken] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then(user => {
        setIsSignedIn(!!user);
      })
      .catch(() => {})
      .finally(() => setInitialized(true));
  }, []);

  const authContext = useMemo(
    () => ({
      isSignedIn,
      authsignalToken,
      setIsSignedIn,
      setAuthsignalToken,
    }),
    [isSignedIn, authsignalToken],
  );

  if (!initialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{animationEnabled: false, headerShown: false}}>
          {isSignedIn ? (
            <Stack.Screen name="Home" component={HomeScreen} />
          ) : (
            <>
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Group
                screenOptions={{
                  animationEnabled: true,
                  headerShown: true,
                  presentation: 'modal',
                }}>
                <Stack.Screen
                  name="CreateAccountStack"
                  component={CreateAccountStack}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="SignInEmailStack"
                  component={SignInEmailStack}
                  options={{headerShown: false}}
                />
              </Stack.Group>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;

function SignInEmailStack() {
  return (
    <Stack.Navigator screenOptions={{headerBackTitleVisible: false}}>
      <Stack.Screen
        name="SignInEmail"
        component={SignInEmailScreen}
        options={{
          title: 'Sign in with email',
        }}
      />
      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmailScreen}
        options={{
          title: 'Verify email',
        }}
      />
    </Stack.Navigator>
  );
}

function CreateAccountStack() {
  return (
    <Stack.Navigator screenOptions={{headerBackTitleVisible: false}}>
      <Stack.Screen
        name="CreateAccount"
        component={CreateAccountScreen}
        options={{
          title: 'Create account',
        }}
      />
      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmailScreen}
        options={{
          title: 'Verify email',
        }}
      />
    </Stack.Navigator>
  );
}
