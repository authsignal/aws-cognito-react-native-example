import {Authsignal} from 'react-native-authsignal';

export const tenantID = '';

// Change for your region if required
export const baseURL = 'https://api.authsignal.com/v1';

export const authsignal = new Authsignal({tenantID, baseURL});

export const userPoolId = '';
export const userPoolClientId = '';
