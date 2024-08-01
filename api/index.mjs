import {Authsignal} from '@authsignal/node';
import bodyParser from 'body-parser';
import express from 'express';
import {JsonDB, Config} from 'node-json-db';
import {v4} from 'uuid';
import {authsignalSecretKey, authsignalURL} from '../config.mjs';

const db = new JsonDB(new Config('user-db'));

const app = express();
const port = 3030;

const authsignalArgs = {
  secret: authsignalSecretKey,
  apiBaseUrl: authsignalURL,
};

const authsignal = new Authsignal(authsignalArgs);

app.use(bodyParser.json());

app.post('/sign-up', async (req, res) => {
  const {userName} = req.body;

  const exists = await db.exists(`/users/${userName}`);

  if (exists) {
    return res.status(400).send({error: 'user already exists'});
  }

  const user = {id: v4(), userName};

  await db.push(`/users/${userName}`, user);

  const {token} = await authsignal.track({action: 'signUp', userId: user.id});

  res.send({token});
});

app.post('/sign-in', async (req, res) => {
  const {userName} = req.body;

  const exists = await db.exists(`/users/${userName}`);

  if (!exists) {
    return res.status(404).send({error: 'user not found'});
  }

  const user = await db.getData(`/users/${userName}`);

  const {token} = await authsignal.track({action: 'signIn', userId: user.id});

  res.send({token});
});

app.post('/session', async (req, res) => {
  const token = req.body.token;

  const {state} = await authsignal.validateChallenge({token});

  if (state === 'CHALLENGE_SUCCEEDED') {
    // TODO: integrate with your IdP here or handle your own session management
    const sessionToken = v4();

    res.send({sessionToken});
  } else {
    res.status(401).send({error: 'unauthorized'});
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
