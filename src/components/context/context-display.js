import { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import AppContext from '../../appContext';

function ContextDisplay() {

  const [context] = useContext(AppContext);

  return (
    <Container fluid>
      <Row>
        <Col md="auto">
          <h4>Current Context</h4>
        </Col>
      </Row>
      <Row>
        <Col md="auto">
          Currency:  {context.currency}
        </Col>
        <Col md="auto">
          Country: {context.country}
      </Col>
        <Col md="auto">
          Channel:  {context.channelName}
      </Col>
        <Col md="auto">
          Store:  {context.storeName}
        </Col>
        <Col md="auto">
          Customer Group: {context.customerGroupName}
        </Col>
        {context.accessToken && 
           <Col md="auto">
             Customer: logged in
          </Col>
        }
      </Row>
      <hr></hr>
    </Container>
  );
      
}

export default ContextDisplay;