import { callCT, requestBuilder } from '../../commercetools';

let VERBOSE=true;

let cart = null;

// Get the current cart or fetch it from commercetools
export const getCart = async() => {
  if(cart) {
    return cart;
  }

  const cartUri = getCartUri();
  console.log(cartUri);
  if(!cartUri)
    return null;
  
  let res =  await callCT({
    uri: cartUri,
    method: 'GET'
  });
  if(res && res.body) {
    cart = res.body;
    return cart;
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

export const updateCart = async(actions) => {
  if(!Array.isArray(actions)) {
    actions = [ actions ];
  }
  console.log('actions',actions);

  if(!cart)
    return;

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
  if(res && res.body) {
    cart = res.body;
    VERBOSE && console.log('cart',cart);
    return cart;
  }
  return null;
}


export const deleteCart = async() => {
  let cartId=sessionStorage.getItem('cartId');
  if(cartId) {
    let res = await callCT({
      uri: requestBuilder.myActiveCart.build(),
      method: 'GET'
    });
    if(res && res.body) {
      callCT({
        uri: requestBuilder.myCarts.byId(res.body.id),
        version: res.body,version,
        method: 'DELETE',
      });
    }
  }
  sessionStorage.removeItem('cartId');
  sessionStorage.removeItem('cart');
  setCart(null);
}




