import React, { useContext, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import AppContext from '../../appContext';
import { authClient, setAccessToken } from '../../commercetools';

const CommercetoolsLogin = () => {

  const [email, setEmail] = useState(null);
  const [status, setStatus] = useState(null);
  const [password, setPassword] = useState(null);
  const [context, setContext] = useContext(AppContext);
 

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  }
  
  const onChangePassword = (event) => {
    setPassword(event.target.value);
  }
  
  const login = async () => {
    console.log('calling login');
    let res = await authClient.customerPasswordFlow({
      username: email,
      password: password
    });
    console.log('login result',res);
    if(res) {
      sessionStorage.setItem('accessToken', res.access_token);
      // Figure out what to do here
      setAccessToken(res.access_token);
      setContext({...context, loggedIn:true});
      setContext({...context, accessToken:res.access_token});
    } else {
      setStatus('Login failed');
    }
    return false;
  };

  const logout = async () => {
    //TODO
  };


  if( context.loggedIn ) {
    return (
      <Container>
        <Row>
          <Col>
            <button onClick={logout}>Log Out</button>
          </Col>
        </Row>
      </Container>
    );;
  } else {
    return (
      <Container>
        <h4>Log in with commercetools</h4>
        <Row>
          <Col md={1}>
            Email:
          </Col>
          <Col>
            <input type="text" name="email" onChange={onChangeEmail}/>
          </Col>
        </Row>
        <Row>
          <Col md={1}>
            Password:
          </Col>
          <Col><input type="password" onChange={onChangePassword}/>
          </Col>
        </Row>
        <Row>
          <Col>
            <button onClick={login}>Log In</button>
          </Col>
        </Row>
      </Container>
    );
  }
};
export default CommercetoolsLogin;

