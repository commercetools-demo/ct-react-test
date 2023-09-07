import { apiRoot } from '../commercetools';
import { getCart, getCustomer } from './cart-util';
import { v4 as uuidv4 } from 'uuid';

// Fetch cart from commercetools, expanding all discount references for display purposes

const queryArgs = {expand: [
    'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount',
    'lineItems[*].price.discounted.discount',
  ]};

export const createPayment = async(cartId, paymentParams) => {
  if(!cartId)
    throw Error("Cannot create payment without cartId");
  const getPaymentMethodsRequest = {
    countryCode: paymentParams.countryCode,
    shopperLocale: "en-US",
    amount: {
        currency: paymentParams.currencyCode,
        value: paymentParams.centAmount
    }
  }
  
  let res =  await apiRoot
    .payments()
    .post({
        body: {
            amountPlanned : {
              currencyCode: paymentParams.currencyCode,
              centAmount : paymentParams.centAmount
            },
            paymentMethodInfo: {
                paymentInterface: "ctp-adyen-integration"
              },
            custom: {
                type: {
                  typeId: "type",
                  key: "ctp-adyen-integration-web-components-payment-type"
                },
                fields: {
                  getPaymentMethodsRequest: JSON.stringify(getPaymentMethodsRequest),
                }
            }
        }
    })
    .execute();
    if(res?.body) {
        return res.body;
    } else {
        throw Error("No payment returned");
    }
    return null;
}

// 
export const addPaymentToCart = async(payment) => {
  let cart = await getCart();
  let customer = await getCustomer();
  console.log("customer", customer)
  if(!cart || !customer || customer.shippingAddressIds.length==0 || customer.billingAddressIds.length==0)
    return;
  
  const shippingAddressId = customer.defaultShippingAddressId ? customer.defaultShippingAddressId : customer.shippingAddressIds[0];
  const billingAddressId = customer.defaultBillingAddressId ? customer.defaultBillingAddressId : customer.billingAddressIds[0];
  let res =  await apiRoot
    .carts()
    .withId({ ID: cart.id })
    .post({
      queryArgs: queryArgs,
      body: {
        version: cart.version,
        actions: [{
            action: 'addPayment',
            payment: {
              id: payment.id,
              typeId: "payment"
            }
          },
          {
            action: 'setShippingAddress',
            address: {
              country: customer.addresses.find((address) => address.id === shippingAddressId)?.country
            }
          },
          {
            action: 'setBillingAddress',
            address: {
              country: customer.addresses.find((address) => address.id === billingAddressId)?.country
            }
          }]
      }
    })
    .execute()
    .catch((e) => {
      console.log("ERROR",e);
      cart.error = e.message;
    });

  if(res?.body) {
    return res.body;
  }
  return cart;
}

export const createSessionRequest = async(payment, paymentParams) => {
    if(!payment)
      throw Error("Cannot create session without payment");
    
    const orderRef = uuidv4();
    const customerRef = uuidv4();
    const localhost = process.env.NODE_ENV === 'test' ? 'localhost:3000' : 'somethingelse';
    const protocol = process.env.NODE_ENV === 'test' ? 'http' : 'https';

    const createSessionRequest = {
        amount: { currency: paymentParams.currencyCode, value: paymentParams.centAmount },
        countryCode: paymentParams.countryCode,
        merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT, // required
        reference: orderRef, // required: your Payment Reference. Random UUID?
        returnUrl: `${protocol}://${localhost}/checkout?orderRef=${orderRef}`, // set redirect URL required for some payment methods (ie iDEAL)
        lineItems: paymentParams.lineItems,
        shopperReference: customerRef,
        shopperInteraction: 'Ecommerce',
        recurringProcessingModel: 'CardOnFile',
        storePaymentMethod: true,
        removeSensitiveData: false,
      };
    let res =  await apiRoot
      .payments()
      .withId({ ID: payment.id })
      .post({
        queryArgs: queryArgs,
        body: {
          version: payment.version,
          actions: [{
              action: 'setCustomField',
              name: "createSessionRequest",
              value: JSON.stringify(createSessionRequest)
            }]
        }
      })
      .execute()
      .catch((e) => {
        console.log("ERROR",e);
        throw Error(e.message);
      });
  
    if(res?.body) {
      return res.body;
    }
    return;
  }


  export const checkPayment = async(paymentId) => {
    if(!paymentId)
      throw Error("Cannot check payment without id");

    let res =  await apiRoot
      .payments()
      .withId({ ID: paymentId })
      .get()
      .execute()
      .catch((e) => {
        console.log("ERROR",e);
        throw Error(e.message);
      });
  
    if(res?.body) {
      return res.body;
    }
    return;
  }

export const createOrder = async(cart) => {
  console.log(cart);

  let res =  await apiRoot
  .orders()
  .post({         
    body: {
        cart: {
            typeId: "cart",
            id: cart.id,
        },
        // taxMode: "External"
        version: cart.version,
    }
  })
  .execute()
  .catch((e) => {
    console.log("ERROR",e);
    cart.error = e.message;
  });
  if(res?.body) {
    return res.body;
  }
  return;
}