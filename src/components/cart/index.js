import { useEffect, useState } from 'react';
import { callCT, requestBuilder } from '../../commercetools';
import LineItemInfo from '../../components/cart/line-item-info';
import ContextDisplay from '../../components/context/context-display';
import LineItemPriceInfo from './line-item-price-info';

const VERBOSE=true;

const CartPage = () => {

  let [cart, setCart] = useState(null);

  useEffect(() => {
    fetchCart();
  });

  const deleteCart = () => {
    // TODO - delete from server as well, but this will work for now...
    sessionStorage.removeItem('cartId');
    setCart(null);
  }

  const incrementQuantity = (lineItem) => {
    console.log('increment',lineItem);
    const action = {
      action: 'changeLineItemQuantity',
      lineItemId: lineItem.id,
      quantity: lineItem.quantity + 1
    }
    updateCart(action);
  }

  const decrementQuantity = (lineItem) => {
    console.log('decrement',lineItem);
    const action = {
      action: 'changeLineItemQuantity',
      lineItemId: lineItem.id,
      quantity: lineItem.quantity - 1
    }
    updateCart(action);
  }

  const getCartUri = () => {
    const cartId = sessionStorage.getItem('cartId');
    if(!cartId)
      return null;

    return requestBuilder.carts.byId(cartId).build() +
    '?expand=lineItems[*].discountedPrice.includedDiscounts[*].discount' +
    '&expand=lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount';
  }

  const updateCart = async(action) => {
    console.log('action',action);
    const cartUri = getCartUri();
    if(!cartUri)
      return;
   
    let res =  await callCT({
      uri: cartUri,
      method: 'POST',
      body: {
        version: cart.version,
        actions: [action]
      },
      verbose: true,
    });
    if(res && res.body) {
      setCart(res.body);
    }
  }
  
  const fetchCart = async () => {
    // Avoid repeat calls
    if(cart)
      return;

    const cartUri = getCartUri();
    if(!cartUri)
      return;

    let res =  await callCT({
      uri: cartUri,
      method: 'GET'
    });
    if(res && res.body) {
      setCart(res.body);
    }
  };

  if(!cart) {
    return null
  }

  return (
    <div>
      <ContextDisplay />
      <h3>Cart {cart.id}</h3>
      
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
