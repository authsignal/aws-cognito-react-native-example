import {Authsignal, VerificationMethod} from '@authsignal/node';
import {CreateAuthChallengeTriggerHandler} from 'aws-lambda';

const secret = process.env.AUTHSIGNAL_SECRET!;
const apiBaseUrl = process.env.AUTHSIGNAL_URL!;

const authsignal = new Authsignal({secret, apiBaseUrl});

export const handler: CreateAuthChallengeTriggerHandler = async event => {
  const userId = event.request.userAttributes.sub;
  const email = event.request.userAttributes.email;

  // Check if a challenge has already been initiated via passkey SDK
  const {challengeId} = await authsignal.getChallenge({
    action: 'cognitoAuth',
    userId,
    verificationMethod: VerificationMethod.PASSKEY,
  });

  const {url, token} = await authsignal.track({
    action: 'cognitoAuth',
    userId,
    email,
    challengeId,
  });

  event.response.publicChallengeParameters = {url, token};

  return event;
};
