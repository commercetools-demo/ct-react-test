import { callCT, requestBuilder } from '../../commercetools';

let VERBOSE=true;

// Fetch cart from commercetools, expanding all discount references for display purposes
export const getCart = async() => {
  const cartUri = getCartUri();
  console.log(cartUri);
  if(!cartUri)
    return null;
  
  let res =  await callCT({
    uri: cartUri,
    method: 'GET'
  });
  if(res?.body && res.body.cartState=='Active') {
    console.log(res.body);
    return res.body;
  }
  return null;
}

const getCartUri = () => {
  const cartId = sessionStorage.getItem('cartId');
  if(!cartId)
    return null;

  return requestBuilder.myCarts.byId(cartId).build() +
  '?expand=lineItems[*].discountedPrice.includedDiscounts[*].discount' +
  '&expand=lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount';
}

// return the cart after update
export const updateCart = async(actions) => {
  if(!Array.isArray(actions)) {
    actions = [ actions ];
  }
  console.log('actions',actions);

  let cart = await getCart();

  const cartUri = getCartUri();
  if(!cartUri)
    return;
    
  let res =  await callCT({
    uri: getCartUri(),
    method: 'POST',
    body: {
      version: cart.version,
      actions: actions
    },
    verbose: true,
  });
  if(res?.body) {
    VERBOSE && console.log(res.body);
    return res.body;
  }
  return null;
}






