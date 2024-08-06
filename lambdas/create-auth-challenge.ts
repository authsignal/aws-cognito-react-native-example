import {Authsignal, VerificationMethod} from '@authsignal/node';
import {CreateAuthChallengeTriggerHandler} from 'aws-lambda';

const secret = process.env.AUTHSIGNAL_SECRET!;
const apiBaseUrl = process.env.AUTHSIGNAL_URL!;

const authsignal = new Authsignal({secret, apiBaseUrl});

export const handler: CreateAuthChallengeTriggerHandler = async event => {
  const userId = event.request.userAttributes.sub;
  const email = event.request.userAttributes.email;

  if (!userId) {
    throw new Error('User is undefined');
  }

  // Check if a challenge has already been initiated via passkey SDK
  const {challengeId} = await authsignal.getChallenge({
    action: 'cognitoAuth',
    userId,
    verificationMethod: VerificationMethod.PASSKEY,
  });

  // Should match your URL Scheme if using the React Native SDK to launch the pre-built UI
  const redirectUrl = 'authsignal://auth';

  const {url, token} = await authsignal.track({
    action: 'cognitoAuth',
    userId,
    email,
    challengeId,
    redirectUrl,
  });

  event.response.publicChallengeParameters = {url, token};

  return event;
};
