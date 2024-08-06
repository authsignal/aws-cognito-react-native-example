import {Authsignal} from 'react-native-authsignal';

const authsignalArgs = {
  tenantID: '',
  baseURL: 'https://api.authsignal.com/v1', // Change for your region if required
};

export const authsignal = new Authsignal(authsignalArgs);

export const userPoolId = '';
export const userPoolClientId = '';
