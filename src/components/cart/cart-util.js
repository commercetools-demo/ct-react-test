import { apiRoot } from '../../commercetools';

let VERBOSE=true;

// Fetch cart from commercetools, expanding all discount references for display purposes

const queryArgs = {expand: 'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount'};

export const getCart = async() => {
  const cartId = sessionStorage.getItem('cartId');
  if(!cartId)
    return null;
  
  let res =  await apiRoot
    .me()
    .carts()
    .withId({ ID: cartId })
    .get({ queryArgs: queryArgs })
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

  let res =  await apiRoot
    .me()
    .carts()
    .withId({ ID: cart.id })
    .post({
      queryArgs: queryArgs,
      body: {
        version: cart.version,
        actions: actions
      }
    })
    .execute()
    .catch((e) => {
      // HACK - stick the error message on the cart.
      console.log("ERROR",e);
      cart.error = e.message;
    });

  if(res?.body) {
    VERBOSE && console.log(res.body);
    return res.body;
  }
  return cart;
}
