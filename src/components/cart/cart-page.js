import LineItemInfo from './line-item-info';
import { useEffect, useState } from 'react';
import ContextDisplay from '../context/context-display';
import LineItemPriceInfo from './line-item-price-info';
import CartCustomFields from './cart-custom-fields';
import { Container, Row, Col} from 'react-bootstrap';
import { getCart, updateCart } from './cart-util';
import { callCT, requestBuilder } from '../../commercetools';
import { withRouter } from "react-router";

const VERBOSE=true;

const CartPage = props => {
  console.log('cart Props',props);
  let [cart, setCart] = useState(null);
  let [fetched, setFetched] = useState(false);

  useEffect(() => {
    getCurrentCart();
  });

  const getCurrentCart = async() => {
    if(fetched)
      return cart;
    setFetched(true);
    setCart(await getCart());
  }

  if(!cart) {
    return (
      <Container fluid>
        <Row>
          <Col>
            no cart.
          </Col>
        </Row>

      </Container>
    )
  }

  const updateCartAndRefresh = async (action) => {
    setCart(await updateCart(action));
  }

  const incrementQuantity = async (lineItem) => {
    const action = {
      action: 'changeLineItemQuantity',
      lineItemId: lineItem.id,
      quantity: lineItem.quantity + 1
    }
    if(lineItem.priceMode=='ExternalPrice') {
      action.externalPrice = lineItem.price.value;
    }
    updateCartAndRefresh(action);
  }
  
  const decrementQuantity = async (lineItem) => {
    console.log('decrement',lineItem);
    const action = {
      action: 'changeLineItemQuantity',
      lineItemId: lineItem.id,
      quantity: lineItem.quantity - 1
    }
    updateCartAndRefresh(action);
  }

  const addDiscountCode = async () => {
    const discountCode=document.getElementById('discountCode').value;
    console.log('discount code',discountCode);
    const action = {
      action: 'addDiscountCode',
      code: discountCode
    }
    updateCartAndRefresh(action);
  }

  const deleteCart = async() => {
    console.log('delete cart');
    let cart = await getCart();
    sessionStorage.removeItem('cartId');
    setCart(null);    
    if(cart) {
      callCT({
        uri: requestBuilder.myCarts.byId(cart.id).withVersion(cart.version).build(),
        method: 'DELETE',
      });
    }

  }

  const checkout = async() => {
    let cart = await updateCart([{
      action: 'setShippingAddress',
      address: {
        country: 'US'
      }
    }]);
    let res;
    if(cart) {
      res = await callCT({
        uri: requestBuilder.orders.build(),
        method: 'POST',
        headers: {
          'X-Correlation-ID': 'test-corr-id'
        },
        body: {
          cart: {
            id: cart.id
          },
          version: cart.version,
        }
      });
      if(res) {
        sessionStorage.setItem('orderId',res.body.id);
        console.log('Order',res.body);
        props.history.push('/order');
      }
    } else {
      console.log('error in update')
    }
  }

  return (
    <div>
      <ContextDisplay />
      
      <Container fluid>
        <Row>
          <Col>
            <h4>Cart</h4>{cart.id}, version {cart.version}
            { cart.error && (
              <h5><font color="red">{cart.error}</font></h5>
            )}
          </Col>
          <Col>
            <CartCustomFields cart={cart} updateCart={updateCartAndRefresh} />        
          </Col>
        </Row>
        <Row>
          
         
        </Row>
        <Row>
          <Col>
          <h4>Line Items</h4>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col><span class="heading">Quantity</span></Col>
          <Col><span class="heading">SKU</span></Col>
          <Col><span class="heading">Name</span></Col>
          <Col><span class="heading">Unit Price</span></Col>
          <Col><span class="heading">Discounted Price</span></Col>
          <Col><span class="heading">Total Price</span></Col>
        </Row>

        { cart.lineItems.map((lineItem,index) => <LineItemInfo 
                                                  key={index} 
                                                  lineItem={lineItem} 
                                                  increment={incrementQuantity.bind(null,lineItem)} 
                                                  decrement={decrementQuantity.bind(null,lineItem)} 
                                                 /> )}                                           
        <Row>
          <Col>
            Add Discount Code: <input id="discountCode" type="text"></input> <button onClick={addDiscountCode}>Add</button>
          </Col>
        </Row>
        <Row>
          <Col md={10}>
            <h4>Cart Total</h4> 
          </Col>
          <Col>
            <LineItemPriceInfo price={cart.totalPrice}/>
          </Col>
        </Row>
        <Row>
          <Col>
            <button type="button" onClick={checkout}>Check Out</button>     
          </Col>
          <Col>
            <button type="button" onClick={deleteCart}>Delete Cart</button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default withRouter(CartPage);
