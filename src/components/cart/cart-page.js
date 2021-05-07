import LineItemInfo from './line-item-info';
import { useEffect, useState } from 'react';
import ContextDisplay from '../context/context-display';
import LineItemPriceInfo from './line-item-price-info';
import CartCustomFields from './cart-custom-fields';
import { Container, Row, Col} from 'react-bootstrap';
import { getCart, updateCart, deleteCart } from './cart-util';

const VERBOSE=true;

const CartPage = () => {

  let [cart, setCart] = useState(null);

  useEffect(() => {
    getCurrentCart();
  });

  const getCurrentCart = async() => {
    setCart(await getCart());
  }

  if(!cart) {
    return null
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
  

  return (
    <div>
      <ContextDisplay />
      <h4>Cart</h4>
      <Container>
        <Row>
          <Col>
            ID: {cart.id}
          </Col>
        </Row>
      </Container>
      
      <CartCustomFields cart={cart} updateCart={updateCartAndRefresh} />
      
      <h4>Line Items</h4>
      <ul>
        { cart.lineItems.map((lineItem,index) => <LineItemInfo 
                                                  key={index} 
                                                  lineItem={lineItem} 
                                                  increment={incrementQuantity.bind(null,lineItem)} 
                                                  decrement={decrementQuantity.bind(null,lineItem)} 
                                                 /> )}
      </ul>
      <h4>Cart Total: <LineItemPriceInfo price={cart.totalPrice}/></h4>
      
      <p></p>
      <button type="button" onClick={deleteCart}>Delete Cart</button>
    </div>
  )
}

export default CartPage;
