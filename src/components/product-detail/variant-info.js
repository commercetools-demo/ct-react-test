import AttributeInfo from './attribute-info';
import { useContext} from 'react';
import PriceInfo from './price-info';
import { Link } from "react-router-dom";
import AppContext from '../../appContext.js';
import { callCT, requestBuilder } from '../../commercetools';
import { withRouter } from "react-router";

const VERBOSE=false;


const VariantInfo = ({history,variant}) => {

  const [context] = useContext(AppContext);
  
  const addToCart = async () => {

    const currency = sessionStorage.getItem('currency');
    const country = sessionStorage.getItem('country');
    const channelId = sessionStorage.getItem('channelId');
    const customerGroupId = sessionStorage.getItem('customerGroupId');
    const storeKey = sessionStorage.getItem('storeKey');

    const productId = context.productId;

    let cart;
    const lineItem = {
      productId: productId,
      variantId: variant.id
    };
    if(channelId) {
      lineItem.distributionChannel={
        id: channelId,
        typeId: 'channel'
      }
    }
    
    // Fetch current cart, if any
    let result = await callCT({
      uri: requestBuilder.myActiveCart.build(),
      method: 'GET'
    });
    if(result) {
      cart = result.body;
      sessionStorage.setItem('cartId',cart.id);
    }

    if(cart) {
      // add item to current cart
      console.log('Adding to current cart',cart.id,cart.version);
      result = await callCT({
        uri: requestBuilder.myCarts.byId(cart.id).build(),
        method: 'POST',
        body: {
          version: cart.version,
          actions: [{
            action: 'addLineItem',
            ...lineItem
          }]
        }
      });
    } else {
      // Create cart and add item in one go. Save cart id
      const createCartBody = {
        currency: currency,
        lineItems: [lineItem]
      };
      if(country) {
        createCartBody.country = country;
      }
      if(customerGroupId) {
        createCartBody.customerGroup = {
          typeId: 'customer-group',
          id: customerGroupId,
        }
      }
      if(storeKey) {
        createCartBody.store = {
          typeId: 'store',
          key: storeKey,
        }
      }
    
      let result = await callCT({
        uri: requestBuilder.myCarts.build(),
        method: 'POST',
        body: createCartBody
      });
      if(result) {
        history.push('/cart');
        sessionStorage.setItem('cartId',result.body.id);
      }
    }
  }
  
  VERBOSE && console.log('variant',variant);
  return (
    <li>
        SKU: { variant.sku } <br></br>
        Variant Key:  { variant.key } <br></br>
        { variant.price
        ? <span>
            Price: (using price selection): {variant.price.value.centAmount/100}
            &nbsp;&nbsp;<button type="button" onClick={addToCart}>Add to Cart</button>
          </span>
        :
          <div>
            Prices:<br></br>
            <small>All prices displayed.  To use Price Selection logic, go to <Link to="/context">Context</Link><br></br>
            and select a currency (required), and one or more additional options.</small>
            <table border="1" cellSpacing="0">
              <thead>
                <tr>
                  <td>Currency</td>
                  <td>Country</td>                
                  <td>Channel</td>
                  <td>Customer Group</td>
                  <td>Price</td>
                </tr>
              </thead>
              <tbody>
              { variant.price
                ? <PriceInfo price={variant.price} />
                : variant.prices.map((price,index) => <PriceInfo key={index} price={price} />)
              }
              </tbody> 
            </table>
          </div>
        }
        <p></p>
        <h4>Attributes:</h4> { variant.attributes.map(attr => <AttributeInfo key={attr.name} attr={attr} />) } <br></br>
        <p></p>
    </li>
  );
}

export default withRouter(VariantInfo);
