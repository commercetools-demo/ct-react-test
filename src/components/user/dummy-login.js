import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../appContext';
//import { authClient, setAccessToken } from '../../commercetools';
import { Container, Row, Col} from 'react-bootstrap';

const DummyLogin = () => {

  const [custId, setCustId] = useState(null);
  const [context, setContext] = useContext(AppContext);
 
  const onChangeCustId = (event) => {
    setCustId(event.target.value);
  }
  
  const login = async () => {
    //setAccessToken(custId);
  };

  const logout = async () => {
    //TODO
  };


  if( context.loggedIn ) {
    return null;
  } else {
    return (
      <Container>
        <h4>Log in with customer id</h4>
        <Row>
          <Col md={1}>
            Customer ID:
          </Col>
          <Col>
            <input type="text" name="custId" onChange={onChangeCustId}/>
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
export default DummyLogin;

