import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Amplify} from 'aws-amplify';
import {getCurrentUser} from 'aws-amplify/auth';
import React, {useEffect, useMemo, useState} from 'react';

import {SignInEmailScreen} from './SignInEmailScreen';
import {CreateAccountScreen} from './CreateAccountScreen';
import {HomeScreen} from './HomeScreen';
import {SignInScreen} from './SignInScreen';
import {userPoolClientId, userPoolId} from './config';
import {AuthContext} from './context';
import {VerifyEmailScreen} from './VerifyEmailScreen';

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
                  name="CreateAccount"
                  component={CreateAccountScreen}
                  options={{
                    title: 'Create account',
                    headerBackTitleVisible: false,
                  }}
                />
                <Stack.Screen
                  name="SignInEmail"
                  component={SignInEmailScreen}
                  options={{
                    title: 'Sign in with email',
                    headerBackTitleVisible: false,
                  }}
                />
                <Stack.Screen
                  name="VerifyEmail"
                  component={VerifyEmailScreen}
                  options={{
                    title: 'Verify email',
                    headerBackTitleVisible: false,
                  }}
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
