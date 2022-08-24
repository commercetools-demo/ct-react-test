import { apiRoot } from '../../commercetools';

let VERBOSE=true;

// Fetch cart from commercetools, expanding all discount references for display purposes

const expand = 'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount';

export const getCart = async() => {
  const cartId = sessionStorage.getItem('cartId');
  if(!cartId)
    return null;
  
  let res =  await apiRoot
    .me()
    .carts()
    .withId({ ID: cartId })
    .get({ queryArgs:
      { expand: expand }
    })
    .execute();

  if(res?.body && res.body.cartState=='Active') {
    console.log(res.body);
  return res.body;
  }
  return null;
}

// return the cart after update
export const updateCart = async(actions) => {
  if(!Array.isArray(actions)) {
    actions = [ actions ];
  }
  console.log('actions',actions);

  let cart = await getCart();
  if(!cart)
    return;

  let err;    
  let res =  await apiRoot
    .me()
    .carts()
    .withId({ ID: cart.id })
    .post({
      body: {
        version: cart.version,
        actions: actions
      }
    })
    .execute();

  if(err) {
    // Hack - stick the error message into the cart.
    console.log("ERROR",err);
    cart.error = err;
    return cart;
  }
  if(res?.body) {
    VERBOSE && console.log(res.body);
    return res.body;
  }
  return null;
}
