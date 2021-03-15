const CLIENT_ID = process.env.REACT_APP_OKTA_CLIENT_ID || '{clientId}';
const ISSUER = process.env.REACT_APP_OKTA_ISSUER || 'https://{yourOktaDomain}.com/oauth2/default';
const OKTA_TESTING_DISABLEHTTPSCHECK = process.env.OKTA_TESTING_DISABLEHTTPSCHECK || false;

// Scopes listed here must match those in Okta -> Security -> API -> (application name) -> Scopes
export default {
  oidc: {
    clientId: CLIENT_ID,
    issuer: ISSUER,
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: [ 'openid', 
              'profile', 
              'email',
              'view_published_products:presales-sunrise-demo',
              'view_products:presales-sunrise-demo',
              'manage_my_orders:presales-sunrise-demo',
              'manage_my_profile:presales-sunrise-demo',
              'view_project_settings:presales-sunrise-demo',
              'view_stores:presales-sunrise-demo'
            ],
    pkce: true,
    disableHttpsCheck: OKTA_TESTING_DISABLEHTTPSCHECK,
  },
  resourceServer: {
    messagesUrl: 'http://localhost:8000/api/messages',
  },
};
