import fetch from 'node-fetch'
import {
  ClientBuilder
} from '@commercetools/sdk-client-v2';

import {
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';

//reference API client credentials from environment variables
const {
  REACT_APP_PROJECT_KEY,
  REACT_APP_CLIENT_SECRET,
  REACT_APP_CLIENT_ID,
  REACT_APP_AUTH_URL,
  REACT_APP_API_URL,
  REACT_APP_SCOPES,
} = process.env

const projectKey = REACT_APP_PROJECT_KEY;

// create the authMiddlewareOptions object
const authMiddlewareOptions = {
  host: REACT_APP_AUTH_URL,
  projectKey,
  credentials: {
    clientId: REACT_APP_CLIENT_ID,
    clientSecret: REACT_APP_CLIENT_SECRET,
  },
  scopes: REACT_APP_SCOPES.split(' '),
  fetch,
};

// create the httpMiddlewareOptions object also
const httpMiddlewareOptions = {
  host: REACT_APP_API_URL,
  fetch,
};

const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey)
  .withAnonymousSessionFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey: projectKey });
