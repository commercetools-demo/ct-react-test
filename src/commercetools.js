import fetch from 'node-fetch'
import { ClientBuilder } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

// From old version - for customer login
import SdkAuth from '@commercetools/sdk-auth';


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

// For handling customer login
export const authClient = new SdkAuth({
  host: REACT_APP_AUTH_URL,
  projectKey: projectKey,
  disableRefreshToken: false,
  credentials: {
    clientId: REACT_APP_CLIENT_ID,
    clientSecret: REACT_APP_CLIENT_SECRET,
  },
  scopes: REACT_APP_SCOPES.split(' '),
})

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

let ctpClient = new ClientBuilder()
  .withProjectKey(projectKey)
  .withAnonymousSessionFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export let apiRoot = createApiBuilderFromCtpClient(ctpClient,REACT_APP_API_URL).withProjectKey({ projectKey: projectKey });

// Create a new client with the new token, and a new api Root
export function setAccessToken(token) {
  ctpClient = new ClientBuilder()
  .withProjectKey(projectKey)
  .withExistingTokenFlow(`Bearer ${token}`, { force: true})
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();
  apiRoot = createApiBuilderFromCtpClient(ctpClient,REACT_APP_API_URL).withProjectKey({ projectKey: projectKey });
}