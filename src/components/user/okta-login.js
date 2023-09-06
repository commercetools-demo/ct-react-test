import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../appContext';
//import { setAccessToken } from '../../commercetools';

const OktaLogin = () => {

  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [context, setContext] = useContext(AppContext);
 

  useEffect(() => {
    if (!authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {
      oktaAuth.getUser().then((info) => {
        setUserInfo(info);
      });
    }
  }, [authState, oktaAuth]); // Update if authState changes

  const login = async () => {
    oktaAuth.signInWithRedirect();
  };

  const logout = async () => {
    oktaAuth.signOut();
  };


  if( authState.isPending ) {
    return (
      <div>Loading authentication...</div>
    );
  } 
  if( !authState.isAuthenticated ) {
    return (
      <div>
        <button onClick={login}>Login with Okta</button>
      </div>
    );
  }
  if( authState.isAuthenticated && userInfo) {

    // TO DO
    //setAccessToken(authState.accessToken.value);
    return (
      <div>
        Welcome, {userInfo.name}<p></p>
        Scopes: {authState.accessToken.scopes.join(',')}<p></p>
        Access Token: {authState.accessToken.value}<p></p>
        <button onClick={logout}>Log out</button>
      </div>
    
    )
  }

  return null;
};
export default OktaLogin;

