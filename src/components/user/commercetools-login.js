import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../appContext';
import { authClient, setAccessToken } from '../../commercetools';
import { Container, Row, Col} from 'react-bootstrap';

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
      // Figure out what to do here
      setAccessToken(res.access_token);
      setContext({...context,loggedIn:true});
    } else {
      setStatus('Login failed');
    }
    return false;
  };

  const logout = async () => {
    //TODO
  };


  if( context.loggedIn ) {
    return null;
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

