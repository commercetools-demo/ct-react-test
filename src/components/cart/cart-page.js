import LineItemInfo from './line-item-info';
import { useEffect, useState } from 'react';
import ContextDisplay from '../context/context-display';
import LineItemPriceInfo from './line-item-price-info';
import CartCustomFields from './cart-custom-fields';
import { Container, Row, Col} from 'react-bootstrap';
import { getCart, updateCart } from '../../util/cart-util';
import { apiRoot } from '../../commercetools';
import { withRouter } from "react-router";

const VERBOSE=true;

const CartPage = props => {
  let [cart, setCart] = useState(null);
  let [fetched, setFetched] = useState(false);

  const currency = sessionStorage.getItem('currency');

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

  const getTotalDiscountAmount = (cart) => {
    let total = {
      centAmount: 0,
      currencyCode: currency
    }
    if(!cart) {
      return 0;
    }
    cart.lineItems?.forEach(item => {
      item.discountedPricePerQuantity?.forEach(dppq => {
        dppq.discountedPrice.includedDiscounts?.forEach(included => {          
          total.centAmount += included.discountedAmount.centAmount * dppq.quantity;
        })
      })
    })
    return total;
  }

  const totalDiscounts = getTotalDiscountAmount(cart);

  const updateCartAndRefresh = async (action) => {
    setCart(await updateCart(action));
    const error = sessionStorage.getItem("error");
    if(error) {
      window.location.reload();
    }
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
    if(lineItem.priceMode=='ExternalPrice') {
      action.externalPrice = lineItem.price.value;
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
      apiRoot
        .carts()
        .withId({ ID: cart.id})
        .delete({
          queryArgs: {
            version: cart.version
          }
        })
        .execute();
    }
  }

  const checkout = async() => {
    let cart = await updateCart([{
      action: 'setShippingAddress',
      address: {
        country: sessionStorage.getItem('country') ?? 'US'
      }
    }]);
    let res;
    if(cart) {
      res = await apiRoot
        .orders()
        .post({         
          body: {
            cart: {
              id: cart.id
            },
            version: cart.version,
          }
      })
      .execute();

      if(res) {
        sessionStorage.setItem('orderId',res.body.id);
        console.log('Order',res.body);
        props.history.push('/order');
      }
    } else {
      console.log('error in update')
    }
  }

  const discountCodes = cart.discountCodes 
    ? cart.discountCodes.map(dc => `${dc.discountCode.obj.code}, matches: ${dc.state == "MatchesCart"}`).join(', ') 
    : '';
  
  return (
    <div>
      <ContextDisplay />
      
      <Container fluid>
        <Row>
          <Col>
            <h4>Cart</h4>
            { cart.error && (
              <h5><font color="red">{cart.error}</font></h5>
            )}
          </Col>
          <Col>
            <CartCustomFields cart={cart} updateCart={updateCartAndRefresh} />        
          </Col>
        </Row>
        <Row>
          &nbsp;
        </Row>
        <Row>
          <Col>
          <h4>Line Items</h4>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col><span className="heading">Quantity</span></Col>
          <Col><span className="heading">SKU</span></Col>
          <Col><span className="heading">Name</span></Col>
          <Col><span className="heading">Unit Price</span></Col>
          <Col><span className="heading">Discounted Price</span></Col>
          <Col><span className="heading">Total Price</span></Col>
        </Row>

        { cart.lineItems.map((lineItem,index) => <LineItemInfo 
                                                  key={index} 
                                                  lineItem={lineItem} 
                                                  increment={incrementQuantity.bind(null,lineItem)} 
                                                  decrement={decrementQuantity.bind(null,lineItem)} 
                                                 /> )}                                           
        <Row>
          <Col>
          { discountCodes && (<span className="small">Discount Codes Applied: {discountCodes}<br/><br/></span>) }
            Add Discount Code: <input id="discountCode" type="text"></input> <button onClick={addDiscountCode}>Add</button>
          </Col>
        </Row>
        <hr></hr>
        <Row>
          <Col md={10}>
            <h6>Total Discounts</h6> 
          </Col>
          <Col>
            <LineItemPriceInfo price={totalDiscounts}/>
          </Col>
        </Row>
        <hr></hr>
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
        <Row>&nbsp;</Row>
      </Container>
      <Container fluid>
        <Row>
          <Col><h4>Metadata</h4>
            Cart ID {cart.id}
            <br/>version {cart.version}
            <br/>createdAt: { cart.createdAt}
            <br/>lastModifiedAt: { cart.lastModifiedAt }
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default withRouter(CartPage);
