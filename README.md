# Authsignal React Native + AWS Cognito Passkeys Example

This example is part of a [guide](https://docs.authsignal.com/sdks/client/react-native) demonstrating how to integrate [Authsignal](https://www.authsignal.com) with [AWS Cognito](https://aws.amazon.com/cognito) when using [React Native](https://reactnative.dev).

It's part of a series of guides showing [different options for integrating Authsignal with AWS Cognito](https://docs.authsignal.com/integrations/aws-cognito/overview).

## Prerequisites

You should follow the prerequisite steps described [here](https://docs.authsignal.com/sdks/client/react-native#prerequisites) to setup your Relying Party and your `apple-app-site-association` and `assetlinks.json` files.

## Installation

```
cd react-native-passkey-example
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
