import { useContext, useState } from 'react';
import AppContext from '../../appContext';
import { Container, Row, Col} from 'react-bootstrap';

function ContextDisplay() {

  const [context] = useContext(AppContext);

  const [error, setError] = useState(sessionStorage.getItem("error"));
  
  const dismiss = () => {
    setError('');
    sessionStorage.setItem("error",'');
  }

  return (
    <Container fluid>
      { error && (
      <Row>
        <h5><font color="red">{error} <button type="button" onClick={dismiss}>dismiss</button></font></h5>
      </Row>
      )}

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
      </Row>
      <Row>
        <Col md="auto">
          Airline: {context.airlineName}
        </Col>
        <Col md="auto">
          Route: {context.routeName}
        </Col>
        <Col md="auto">
          Flight: {context.flightName}
        </Col>
        <Col md="auto">
          Class: {context.className}
        </Col>
      </Row>
      <hr></hr>
    </Container>
  );
      
}

export default ContextDisplay;