/* Encapsulate the JS SDK modules into a simple pair of exports:
  callCT - call commercetool via the sdk-client "execute" method 
    (https://commercetools.github.io/nodejs/sdk/api/sdkClient.html)

  requestBuilder - create request URI components.
    (https://commercetools.github.io/nodejs/sdk/api/apiRequestBuilder.html)    
*/

import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createClient } from '@commercetools/sdk-client'
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'

// Log all requests & responses to the console:
const VERBOSE=true;


// Included automatically by react-scripts.  If not using react, use dotenv to load environment vars instead.
const authUrl = process.env.REACT_APP_AUTH_URL;
const projectKey = process.env.REACT_APP_PROJECT_KEY;
const clientId = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
const scopes = [process.env.REACT_APP_SCOPES];
const apiUrl = process.env.REACT_APP_API_URL;

const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
  host: authUrl,
  projectKey: projectKey,
  credentials: {
    clientId: clientId,
    clientSecret: clientSecret,
  },
  scopes: scopes
})

const httpMiddleware = createHttpMiddleware({
  host: apiUrl,
})

const client = createClient({
  middlewares: [authMiddleware, httpMiddleware],
})

/* Provide a requestBuilder object that will create URI components for common commercetools operations
(see https://commercetools.github.io/nodejs/sdk/api/apiRequestBuilder.html )
*/
export const requestBuilder = createRequestBuilder({projectKey})

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
export async function callCT(args) {
  if(VERBOSE) {
    console.log('Calling commercetools:',args.method,args.uri)
    if(args.method=='POST') {
      console.log(args.body)
    }
  }
  let res = await client.execute({
    uri: args.uri,
    method: args.method,
    body: args.body,
  }).catch(err => console.log('Error from commercetools',err));

  if(res && VERBOSE) {
    console.log('Response from commercetools',res);
  }
  return res;
}
