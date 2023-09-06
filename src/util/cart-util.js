import { apiRoot } from '../commercetools';

let VERBOSE=true;

// Fetch cart from commercetools, expanding all discount references for display purposes

const queryArgs = {expand: [
    'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount',
    'lineItems[*].price.discounted.discount',
  ]};

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
    let recalculatedCart = await apiRoot
        .me()
        .carts()
        .withId({ ID: cartId })
        .post({
          queryArgs: queryArgs,
          body: {
            version: res.body.version,
            actions: [
              {
                action: "recalculate",
                updateProductData: true,
              }
            ]
          }
        })
        .execute()
    return recalculatedCart.body;
  }
  return null;
}

export const getCustomer = async() => {
  
  let res =  await apiRoot
  .me()
  .get()
  .execute();
  if(res?.body) {
    return res?.body;
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
    return res.body;
  }
  return cart;
}

export const addToCart = async (productId, variantId, custom) => {

  const currency = sessionStorage.getItem('currency');
  const country = sessionStorage.getItem('country');
  const channelId = sessionStorage.getItem('channelId');
  const customerGroupId = sessionStorage.getItem('customerGroupId');
  const storeKey = sessionStorage.getItem('storeKey');

  let cart;
  const lineItem = {
    productId,
    variantId
  };
  if(channelId) {
    lineItem.distributionChannel={
      id: channelId,
      typeId: 'channel'
    }
  }
  // Add custom fields, if any
  lineItem.custom = custom;
  
  // Fetch current cart, if any.  Swallow error (TODO: check 404)
  let result = await apiRoot
    .me()
    .activeCart()
    .get()
    .execute()
    .catch( (error) => { console.log('err',error) } );

  if(result) {
    cart = result.body;
    sessionStorage.setItem('cartId',cart.id);
  }

  if(cart) {
    // add item to current cart
    console.log('Adding to current cart',cart.id,cart.version);
    result = await apiRoot
      .me()
      .carts()
      .withId({ID: cart.id})
      .post({
        body: {
          version: cart.version,
          actions: [{
            action: 'addLineItem',
            ...lineItem
          }]
        }
    }).execute();
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
  
    result = await apiRoot
      .me()
      .carts()
      .post({
        body: createCartBody
      })
      .execute();
  }
  if(result) {
    console.log('result',result);
    sessionStorage.setItem('cartId',result.body.id);
  }
  return result;
}
