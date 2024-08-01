# Authsignal React Native + AWS Cognito Passkeys Example

This example shows how to integrate [Authsignal](https://www.authsignal.com/) with [React Native](https://reactnative.dev/) and [AWS Cognito](https://aws.amazon.com/cognito/).

If you're looking for a similar example but for the Web instead of React Native, you can find one [here](https://docs.authsignal.com/integrations/aws-cognito/amplify-passkeys).

This app is referenced in our [official guide](https://docs.authsignal.com/integrations/aws-cognito) on how to integrate Authsignal with AWS Cognito.

## Prerequisites

You should follow the prerequisite steps described [here](https://docs.authsignal.com/sdks/client/react-native#prerequisites) to setup your Relying Party and your `apple-app-site-association` and `assetlinks.json` files.

## 1. Installation

Clone the repo on the `with-aws-cognito` branch:

```
git clone --branch with-aws-cognito https://github.com/authsignal/react-native-passkey-example
```

Then install dependencies inside the repo:

```
cd react-native-passkey-example
yarn install
npx pod-install ios
```

## 2. Configuration

To update the backend configuration used by the lambdas, copy [this file](https://github.com/authsignal/react-native-passkey-example/tree/with-aws-cognito/lambdas/.env.example) and rename it from `.env.example` to `.env` then update it with your secret key and the appropriate URL for your [region](https://docs.authsignal.com/api/server-api#region-selection).

To update the client configuration used by the app, copy [this file](https://github.com/authsignal/react-native-passkey-example/blob/with-aws-cognito/.env.local.example) and rename it from `.env.local.example` to `.env.local` then update it with the values for your Cognito user pool and your Authsignal tenant and [region](https://docs.authsignal.com/api/client-api/overview#region-selection).

## 3. The lambda triggers

#### Deploying the lambda triggers

The example repo contains [four lambdas](https://github.com/authsignal/react-native-passkey-example/blob/with-aws-cognito/lambdas) which can be deployed to your AWS environment using [serverless framework](https://www.serverless.com/).
To deploy these lambdas, clone the [Github repo](https://github.com/authsignal/react-native-passkey-example/tree/with-aws-cognito) and run the following command:

```
cd lambdas
npx serverless deploy --region YOUR_REGION
```

#### Connecting the lambda triggers

Once deployed, these lambdas can be connected to your Cognito user pool:

![AWS Cognito triggers!](/cognito-triggers.png 'AWS Cognito triggers')

#### Create auth challenge lambda

This lambda uses the [Authsignal Node.js SDK](https://docs.authsignal.com/sdks/server/node) to return a short-lived token back to the app which can be passed to the [Authsignal Web SDK](https://docs.authsignal.com/sdks/client/browser-sdk) to initiate a passkey challenge:

```ts
export const handler: CreateAuthChallengeTriggerHandler = async event => {
  const userId = event.request.userAttributes.sub;

  const {token} = await authsignal.track({action: 'cognitoAuth', userId});

  event.response.publicChallengeParameters = {token};

  return event;
};
```

#### Verify auth challenge response lambda

This lambda takes the result token returned by the [Authsignal Web SDK](https://docs.authsignal.com/sdks/client/browser-sdk) and passes it to the [Authsignal Node.js SDK](https://docs.authsignal.com/sdks/server/node) to validate the result of the challenge:

```ts
export const handler: VerifyAuthChallengeResponseTriggerHandler =
  async event => {
    const userId = event.request.userAttributes.sub;
    const token = event.request.challengeAnswer;

    const {state} = await authsignal.validateChallenge({userId, token});

    event.response.answerCorrect = state === 'CHALLENGE_SUCCEEDED';

    return event;
  };
```

#### Define auth challenge and pre sign up lambdas

These lambdas don't have any interesting interaction with Authsignal but are required to get things working end-to-end. You can find out more info about what they do in [this AWS blog post](https://aws.amazon.com/blogs/mobile/implementing-passwordless-email-authentication-with-amazon-cognito/).

## 4. The app

#### Running the app

To start the app run the following command:

```
yarn dev
```

#### Sign up

We use Amplify to begin sign up, which invokes the create auth challenge lambda and receives an initial token as a `challengeParam`.
We pass this initial token to the Authsignal SDK, which presents the native UI to register a new passkey, and then we pass the result token back to Amplify as the challenge answer.

```ts
let cognitoUser: any;

const onPressSignUp = async () => {
  const signUpParams = {
    username: userName,
    password: Math.random().toString(36).slice(-16) + 'X',
  };

  await Auth.signUp(signUpParams);

  cognitoUser = await Auth.signIn(userName);

  const {token} = cognitoUser.challengeParam;

  const {data, error} = await authsignal.passkey.signUp({token, userName});

  await Auth.sendCustomChallengeAnswer(cognitoUser, data);
};
```

Similar to the example in [this AWS blog post](https://aws.amazon.com/blogs/mobile/implementing-passwordless-email-authentication-with-amazon-cognito/), a dummy password is randomly generated because Amplify requires one when signing up, but it won't actually be used.

#### Sign in

We use Amplify to begin sign in, which invokes the create auth challenge lambda and receives an initial token as a `challengeParam`.
We pass this initial token to the Authsignal SDK, which presents the native UI to authenticate with a passkey, and then we pass the result token back to Amplify as the challenge answer.

```ts
let cognitoUser: any;

const onPressSignIn = async () => {
  cognitoUser = await Auth.signIn(userName);

  const {token} = cognitoUser.challengeParam;

  const {data, error} = await authsignal.passkey.signIn({token});

  await Auth.sendCustomChallengeAnswer(cognitoUser, data);
};
```

> > > > > > > awc2
