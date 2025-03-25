import {Authsignal, VerificationMethod} from '@authsignal/node';
import {CreateAuthChallengeTriggerHandler} from 'aws-lambda';

const apiSecretKey = process.env.AUTHSIGNAL_SECRET!;
const apiUrl = process.env.AUTHSIGNAL_URL!;

const authsignal = new Authsignal({apiSecretKey, apiUrl});

export const handler: CreateAuthChallengeTriggerHandler = async event => {
  const userId = event.request.userAttributes.sub;
  const email = event.request.userAttributes.email;

  if (!userId) {
    throw new Error('User is undefined');
  }

  // Check if a challenge has already been initiated via passkey SDK
  const {challengeId} = await authsignal.getChallenge({
    userId,
    action: 'cognitoAuth',
    verificationMethod: VerificationMethod.PASSKEY,
  });

  const {token} = await authsignal.track({
    userId,
    action: 'cognitoAuth',
    attributes: {
      email,
      challengeId,
    },
  });

  event.response.publicChallengeParameters = {token};

  return event;
};
