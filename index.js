import {AppRegistry} from 'react-native';
import App from './src/components/App';
import {name as appName} from './app.json';

import {Amplify} from 'aws-amplify/';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-west-2_VkdUWn6a2',
      userPoolClientId: '2cdp2u0h56vo8ikm9vhtq2nsm1',
    },
  },
});

AppRegistry.registerComponent(appName, () => App);
