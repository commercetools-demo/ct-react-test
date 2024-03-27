import { useContext, useState, useEffect } from 'react';
import ContextDisplay from '../context/context-display';
import AirlinePicker from './airline-picker';
import RoutePicker from './route-picker';
import FlightPicker from './flight-picker';
import ClassPicker from './class-picker';
import StoreLookup from './store-lookup';
import Categories from './categories';
import { Container, Row, Col} from 'react-bootstrap';
import AppContext from '../../appContext';


function StorePage() {

  const [context] = useContext(AppContext);

  console.log('CONTEXT',context);

  return (
    <div>
      <ContextDisplay />
        <Container>
          <Row>
            <Col>
              Select airline, route, class to select a menu.
              <Row>
                <AirlinePicker />
              </Row>
              <Row>
                <RoutePicker />
              </Row>
              <Row>
                <FlightPicker />
              </Row>
              <Row>
                <ClassPicker />
              </Row>
            </Col>
            <Col>
              <Row>
                <StoreLookup></StoreLookup>
              </Row>
              <Row>
                <Categories parentId={context.rootCategory}></Categories>
              </Row>
            </Col>
          </Row>
        </Container>
      <Container fluid>
        <p></p>

        <p></p>

      </Container>
    </div>
  );
}

export default StorePage;