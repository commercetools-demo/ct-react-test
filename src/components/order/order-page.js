import { useEffect, useState } from 'react';
import ContextDisplay from '../context/context-display';
import { Container, Row, Col} from 'react-bootstrap';
import { apiRoot } from '../../commercetools-ts';

const VERBOSE=true;

const OrderPage = () => {

  let [order, setOrder] = useState(null);
  let [fetched, setFetched] = useState(false);

  useEffect(() => {
    getCurrentOrder();
  });

  const getCurrentOrder = async() => {
    if(fetched)
      return order;
    setFetched(true);
    setOrder(await fetchOrder());
  }


  const fetchOrder = async() => {
    let orderId = sessionStorage.getItem('orderId');
    if(!orderId)
      return null;

    let res = await apiRoot
      .orders()
      .withId({ID: orderId})
      .get()
      .execute();

    if(res?.body) {
      return res.body;
    }
  }
  
  if(!order) {
    return (
      <Container fluid>
        <Row>
          <Col>
            no current order.
          </Col>
        </Row>

      </Container>
    )
  }
  console.log(order);


  return (
    <div>
      <ContextDisplay />
      
      <Container fluid>
        <Row>
          <Col>
            <h4>Order</h4>{order.id}
          </Col>
        </Row>
      </Container>         
    </div>
  )
}

export default OrderPage;
