/* Encapsulate the JS SDK modules into a simple pair of exports:
  callCT - call commercetool via the sdk-client "execute" method 
    (https://commercetools.github.io/nodejs/sdk/api/sdkClient.html)

  requestBuilder - create request URI components.
    (https://commercetools.github.io/nodejs/sdk/api/apiRequestBuilder.html)    
*/

import { createRequestBuilder } from '@commercetools/api-request-builder';
import SdkAuth from '@commercetools/sdk-auth';
import { createClient } from '@commercetools/sdk-client';
import { createAuthMiddlewareForAnonymousSessionFlow, createAuthMiddlewareWithExistingToken } from '@commercetools/sdk-middleware-auth';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';

// Log all requests & responses to the console:
const VERBOSE=true;

// Included automatically by react-scripts.  If not using react, use dotenv to load environment vars instead.
const authUrl = process.env.REACT_APP_AUTH_URL;
const projectKey = process.env.REACT_APP_PROJECT_KEY;
const clientId = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
const scopes = [process.env.REACT_APP_SCOPES];
const apiUrl = process.env.REACT_APP_API_URL;

// By default, we start out with an authentication request for an anonymous user
const authMiddleware = createAuthMiddlewareForAnonymousSessionFlow({
  host: authUrl,
  projectKey: projectKey,
  credentials: {
    clientId: clientId,
    clientSecret: clientSecret,
  },
  scopes: scopes
})

export const authClient = new SdkAuth({
  host: authUrl,
  projectKey: projectKey,
  disableRefreshToken: false,
  credentials: {
    clientId: clientId,
    clientSecret: clientSecret,
  },
  scopes: scopes
})


const httpMiddleware = createHttpMiddleware({
  host: apiUrl,
})

let client = createClient({
  middlewares: [authMiddleware, httpMiddleware],
})

// Setting an access token has the side effect of creating a new 
// client with the createAuthMiddlewareWithExistingToken auth middleware
export function setAccessToken(accessToken) {
  client = createClient({
    middlewares: [
      createAuthMiddlewareWithExistingToken(`Bearer ${accessToken}`, {
        force: true,
      }),
      httpMiddleware
    ],
  })
  console.log(client);
}

/* Provide a requestBuilder object that will create URI components for common commercetools operations
(see https://commercetools.github.io/nodejs/sdk/api/apiRequestBuilder.html )
https://docs.commercetools.com/api/authorization#requesting-an-access-token-using-commercetools-oauth-20-server
*/
const options = {
  projectKey: projectKey,
  customServices: {
    myProfile: {
      type: 'customer',
      endpoint: '/me',
      features: ['update']
    }
  }
}
export const requestBuilder = createRequestBuilder(options);

/* Call commercetools with the following arguments:

uri: The uri component after the API host, typically created by requestBuilder
(see https://commercetools.github.io/nodejs/sdk/api/apiRequestBuilder.html )
method: 'GET', 'POST', 'DELETE', etc.
body (for POST): The JSON data to pass as a payload.

NOTE: You are not specifically required to use requestBuilder, you can construct URIs by hand, but keep in mind
the following if NOT using requestBuilder:
1. You need to include the project key
2. parameters in "where" clauses need to be encoded via encodeURIComponent

*/
export async function callCTWithError(args) {
  if(VERBOSE) {
    console.log('Calling commercetools:',args.method,args.uri)
    if(args.method=='POST') {
      console.log(args.body)
    }
  }
  let res, message;
  try {
    res = await client.execute({
      ...args
    });
  } catch(err) {
    message = err.message;
    console.log(err.message);
  }
  if(res && VERBOSE) {
    console.log('Response from commercetools',res);
  }
  return [ res, message ];
}

export async function callCT(args) {
  let [ res, err ] = await callCTWithError(args);
  return res;
}
