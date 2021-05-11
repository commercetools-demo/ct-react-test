import { useEffect, useState } from 'react';
import ContextDisplay from '../context/context-display';
import { Container, Row, Col} from 'react-bootstrap';
import { callCT, requestBuilder } from '../../commercetools';

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
    console.log('fetch');
    let orderId = sessionStorage.getItem('orderId');
    if(!orderId)
      return null;

    let res = await callCT({
      uri: requestBuilder.orders.byId(orderId).build(),
      method: 'GET'
    })
    console.log(res);
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
