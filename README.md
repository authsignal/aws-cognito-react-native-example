# Authsignal React Native + AWS Cognito Passkeys Example

This example is part of a [guide](https://docs.authsignal.com/integrations/aws-cognito/react-native) demonstrating how to integrate [Authsignal](https://www.authsignal.com) with [AWS Cognito](https://aws.amazon.com/cognito) when using [React Native](https://reactnative.dev).

It's part of a series of guides showing [different options for integrating Authsignal with AWS Cognito](https://docs.authsignal.com/integrations/aws-cognito/overview).

## Prerequisites

You should follow the prerequisite steps described [here](https://docs.authsignal.com/sdks/client/react-native#prerequisites) to setup your Relying Party and your `apple-app-site-association` and `assetlinks.json` files.

## Installation

```
yarn install
npx pod-install ios
```

## Configuration

Update [this file](https://github.com/authsignal/aws-cognito-react-native-example/blob/main/src/config.ts) with the config values for your Authsignal tenant and region-specific URL, along with the values for your AWS Cognito user pool.

## The AWS lambdas

### Create Auth Challenge lambda

You can find the full lambda code for this example [here](https://github.com/authsignal/aws-cognito-react-native-example/blob/main/lambdas/create-auth-challenge.ts).

### Verify Auth Challenge Response lambda

You can find the full lambda code for this example [here](https://github.com/authsignal/aws-cognito-react-native-example/blob/main/lambdas/verify-auth-challenge-response.ts).

## The app code

### Sign up

You can find a full example of the sign up implementation [here](https://github.com/authsignal/aws-cognito-react-native-example/blob/main/src/CreateAccountScreen.tsx#L41).

#### 1. Call Amplify SDK `signUp` method

Pass the email as the username.

```ts
await signUp({
  username: email,
  password: Math.random().toString(36).slice(-16) + 'X', // Dummy value - never used
  options: {
    userAttributes: {
      email,
    },
  },
});
```

#### 2. Call Amplify SDK `signIn` method

This step invokes the [Create Auth Challenge lambda](https://github.com/authsignal/aws-cognito-react-native-example/blob/main/lambdas/create-auth-challenge.ts).

```ts
const {nextStep} = await signIn({
  username: email,
  options: {
    authFlowType: 'CUSTOM_WITHOUT_SRP',
  },
});
```

#### 3. Launch Authsignal pre-built UI

Pass the url returned by the [Create Auth Challenge lambda](https://github.com/authsignal/aws-cognito-react-native-example/blob/main/lambdas/create-auth-challenge.ts).

```ts
const url = nextStep.additionalInfo.url;

const token = await launch(url);
```

#### 4. Call Amplify SDK `confirmSignIn` method

This step invokes the [Verify Auth Challenge Response lambda](https://github.com/authsignal/aws-cognito-react-native-example/blob/main/lambdas/verify-auth-challenge-response.ts).

```ts
const {isSignedIn} = await confirmSignIn({
  challengeResponse: token,
});
```

### Sign in

You can find a full example of the sign in implementation [here](https://github.com/authsignal/aws-cognito-react-native-example/blob/main/src/SignInScreen.tsx#L22).

#### 1. Call Authsignal SDK `passkey.signIn` method

```ts
const {data} = await authsignal.passkey.signIn({
  action: 'cognitoAuth',
});
```

#### 2. Call Amplify SDK `signIn` and `confirmSignIn` methods

Pass the username and token returned by the Authsignal SDK.

```ts
await signIn({
  username: data.username,
  options: {
    authFlowType: 'CUSTOM_WITHOUT_SRP',
  },
});

const {isSignedIn} = await confirmSignIn({
  challengeResponse: data.token,
});
```
