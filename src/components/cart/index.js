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

  const fetchCart = async () => {

    const cartId = sessionStorage.getItem('cartId');
    // Avoid repeat calls (?)
    if(cart || !cartId) {
      return;
    }

    let cartUri = requestBuilder.carts.byId(cartId).build() +
    '?expand=lineItems[*].discountedPrice.includedDiscounts[*].discount';

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
        { cart.lineItems.map((lineItem,index) => <LineItemInfo key={index} lineItem={lineItem}/>) }
      </ul>
      <h4>Cart Total: <LineItemPriceInfo price={cart.totalPrice}/></h4>
      
      <p></p>
      <button type="button" onClick={deleteCart}>Delete Cart</button>
    </div>
  )
}

export default CartPage;
