import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { apiRoot } from '../../commercetools';
import ContextDisplay from '../context/context-display';

const VERBOSE=true;

const OrderPage = () => {

  let [order, setOrder] = useState(null);
  let [fetched, setFetched] = useState(false);
  
  const paymentMethodId = sessionStorage.getItem('paymentMethodId');

  useEffect(() => {
    getCurrentOrder();
  });

  const getCurrentOrder = async() => {
    if(fetched)
      return order;
    setFetched(true);
    setOrder(await fetchOrder());
  }

  const deleteOrder = async () => {
    let orderId = sessionStorage.getItem('orderId');

    const deleted = await apiRoot
      .orders()
      .withId({ID: orderId})
      .delete({
        queryArgs: {
          version: 1
        }
      })
      .execute();
    
    sessionStorage.removeItem('orderId');
    sessionStorage.removeItem('paymentMethodId');

    setOrder(null);
    setFetched(false)

    return deleted;
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

    return null;
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
            <button onClick={deleteOrder}>Delete</button>
          </Col>
        </Row>
        <Row>
          <Col>
            <h4>Payment method</h4>{paymentMethodId}
          </Col>
        </Row> 
      </Container>         
    </div>
  )
}

export default OrderPage;
