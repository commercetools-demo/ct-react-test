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
    if (!cart.shippingAddress?.city) {
      let customer = await getCustomer();
      const shippingAddressId = customer.defaultShippingAddressId ? customer.defaultShippingAddressId : customer.shippingAddressIds[0];
      cart = await apiRoot
      .me()
      .carts()
      .withId({ID: cart.id})
      .post({
        body: {
          version: cart.version,
          actions: [{
            action: 'setShippingAddress',
            address: {
              country: customer.addresses.find((address) => address.id === shippingAddressId)?.country,
              city: customer.addresses.find((address) => address.id === shippingAddressId)?.city,
              state: customer.addresses.find((address) => address.id === shippingAddressId)?.state,
              firstName: customer.addresses.find((address) => address.id === shippingAddressId)?.firstName,
              lastName: customer.addresses.find((address) => address.id === shippingAddressId)?.lastName,
              streetName: customer.addresses.find((address) => address.id === shippingAddressId)?.streetName,
              streetNumber: customer.addresses.find((address) => address.id === shippingAddressId)?.streetNumber,
              postalCode: customer.addresses.find((address) => address.id === shippingAddressId)?.postalCode,
            }
          }]
        }
      }).execute();
    }
    if (!cart.genesisOrgId) {
      cart = await apiRoot
      .me()
      .carts()
      .withId({ID: cart.id})
      .post({
        body: {
          version: cart.version,
          actions: [{
            action: "setCustomField",
            name: "selectedGenesisOrgId",
            value: 5772923323852
            }]
        }
      }).execute();
    }
    const cartId = cart.id || cart.body.id;
    const cartVersion = cart.version || cart.body.version;
    console.log("Cart Update Line Items",cartId )
    console.log("cartPayload", {
      version: cartVersion,
      actions: [{
        action: 'addLineItem',
        ...lineItem
      },]
    })
    result = await apiRoot
      .me()
      .carts()
      .withId({ID: cartId})
      .post({
        body: {
          version: cartVersion,
          actions: [{
            action: 'addLineItem',
            ...lineItem
          },
          {
            action: 'setCustomerEmail',
            email: 'api.avalara@test.com'
          }]
        }
    }).execute();
  } else {
    // Create cart and add item in one go. Save cart id
    const createCartBody = {
      currency: currency,
      lineItems: [lineItem],
      taxMode: "External",
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
    createCartBody.custom = {
      type: {
        key: "cart-order-custom-type-information",
        typeId: "type"
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
    console.log('create cart result',result);
    sessionStorage.setItem('cartId',result.body.id);
  }
  return result;
}
