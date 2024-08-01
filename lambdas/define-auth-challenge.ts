import {DefineAuthChallengeTriggerHandler} from 'aws-lambda';

export const handler: DefineAuthChallengeTriggerHandler = async event => {
  const {session} = event.request;

  const challengeSucceeded =
    session &&
    session.length > 0 &&
    session[session.length - 1].challengeResult === true;

  if (challengeSucceeded) {
    event.response.issueTokens = true;
    event.response.failAuthentication = false;
  } else {
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = 'CUSTOM_CHALLENGE';
  }

  return event;
};
