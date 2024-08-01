import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthUser, getCurrentUser} from 'aws-amplify/auth';
import React, {useEffect, useState} from 'react';

import {HomeScreen} from './HomeScreen';
import {LoginScreen} from './LoginScreen';

const Stack = createStackNavigator();

function App() {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState<AuthUser | undefined>();

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => {})
      .finally(() => setInitialized(true));
  }, []);

  if (!initialized) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? 'Home' : 'Login'}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
