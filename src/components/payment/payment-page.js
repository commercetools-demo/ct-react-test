// @ts-check

import axios from 'axios';
import React, { Component } from "react";
import { withRouter } from "react-router";
import { useRef, useEffect } from 'react';
import { getCart, updateCart } from '../../util/cart-util';

import AdyenCheckout from '@adyen/adyen-web';
import paymentMethodsMock from "./paymentMethodsMock.json";
import '@adyen/adyen-web/dist/adyen.css';

const URL_APP = 'http://localhost:3001';


const AdyenForm = () => {

  const paymentContainer = useRef(null);

  useEffect(() => {
    let hasRun = false;

    const createCheckout = async () => {
      if (hasRun) return;

      const cart = await getCart();
      console.log(cart);

      const currency = cart?.totalPrice.currencyCode;
      const countryCode = cart?.shippingAddress?.country;
      const price =  cart?.totalPrice.centAmount; // value is 100€ in minor units
      const lineItems = cart?.lineItems.map((item) => {
        return {  
          id: item.id,
          description: item.name['en-US'],
          quantity: item.quantity,
          amountIncludingTax: item.totalPrice.centAmount,
          name: item.name['en-US'],
          sku: item.variant.sku,
          type: 'LineItem',
        }});

      const session = await axios.post(`${URL_APP}/api/sessions`,  {
        currency,  
        price, 
        countryCode,
        lineItems,
    });

      const checkout = await AdyenCheckout({
        session: session.data,
        clientKey: process.env.REACT_APP_ADYEN_CLIENT_KEY, // Web Drop-in versions before 3.10.1 use originKey instead of clientKey.
        locale: 'en-US',
        environment: 'test',
        paymentMethodsResponse: paymentMethodsMock,
      });


      /*
      {
        "amountPlanned": {
          "type": "centPrecision",
          "currencyCode": "EUR",
          "centAmount": 1000,
          "fractionDigits": 2
        },
        "custom": {
          "type": {
            "typeId": "type",
            "key": "ctp-adyen-integration-web-components-payment-type"
          },
          "fields": {
            "adyenMerchantAccount": "YOUR_MERCHANT_ACCOUNT",
            "commercetoolsProjectKey": "YOUR_COMMERCETOOLS_PROJECT_KEY",
            "createSessionRequest": "{ \"amount\": { \"currency\": \"EUR\", \"value\": 1000 }, \"reference\": \"YOUR_REFERENCE\", \"channel\": \"Web\", \"returnUrl\": \"https://your-company.com/...\", \"merchantAccount\": \"YOUR_MERCHANT_ACCOUNT\" }",
            "createSessionResponse": "{ \"amount\": { \"currency\": \"EUR\", \"value\": 1000 }, \"channel\": \"Web\", \"expiresAt\": \"2023-02-17T11:35:33+01:00\", \"id\": \"CSF86BB73115FBC5D0\", \"merchantAccount\": \"YOUR_MERCHANT_ACCOUNT\", \"reference\": \"YOUR_REFERENCE\", \"returnUrl\": \"https://your-company.com/...\", \"mode\": \"embedded\", \"sessionData\": \"Ab02b4c0!BQABAgAJTWczsOnM2OfQiSIe2OBwocp8oaXCbcRDBq9+7BlIocB9Yge4G0T9NygFsfawRu1Q8sX1QdU7yRNFi22JjLA1Ir8GnXKpntQrSP1jNjeOfGzQ1Gd9unwbANzieM7TIwvWBcZ3oEG4KULV7vtrwKJ49BMPJCxm324yx5wGUX0zsObFimbg879oYtPQ37iGDDxzuBt6Ykd5qT9KWv9V2X/MBY/YzWAgPfa0Ge7yQYbw4yckAwrWlj/ZRidGTCX3QxfjCI33CA3iBuQQ1tlgTHAyG7BWa+H03x6L6ePG/bqr4zdOf2zwk3MCwDX85sc/S4fipGmgTIADj+eCbuFr0MmVX2eogi/eBdF2koXpcfRsfL/SvvQS4D1HcOnz6ol3S2tOQN2y7Iw/tTfVM+5piarSskzx4Nbt0WHdrBD7K02GKCUhW/FI50isQoKAkL4kTfPG5GIWCWfY2TfE0lj+VgKofwn3CFI5Rw7BwRDp0kFeeI3N45nvVUFbN9X4jJz/FiR67X1pa9SCy2Qbzs5IdUg+kD20TjAtenqaMFF9A5/KNwa/1aBaA540+Xzon8R6s7LiCtmp6JDUg6UuDsfLpkHR1J5zKZziWglaHNzKpu1i38+70LAc2dDT2WON662r+mw5hUx1T2x9bfVL429YwlGfda0ciz/SuEp54EINg9FSvQznSoHzLQp56Fqd1j0ASnsia2V5IjoiQUYwQUFBMTAzQ0E1MzdFQUVEODdDMjRERDUzOTA5QjgwQTc4QTkyM0UzODIzRDY4REFDQzk0QjlGRjgzMDVEQyJ9mzQ0ZhdH9ofifR2Ut1dGxRPkc0VEf9CTWSOZ12vL0O6DQpQH7KSEJ/JQCOzenhuuldhRNCfhK33hvYaLhHoFNvDI5/66uRjMiG9bZeQSlb7wI0UoByPGoUbWYXihIGrMCVstX/6evF3EYGlGhKvE7HSR7LFOzbyFxYc/N3vq4IYTvOQztUm+IPT9bUjY3nxFx4Khd/0FZ7JpyI7lvEXMGhY+L7gjsLvzy98sqLC40w1GI7zpR4O2UTNGy6ZPJ5ECEPzVr74dz9LaWmzpCPulWNSqVbHxD3mYnWqKmueQH2ozXaFRo/HQIk/BKvYREKz1iR1ES2Kq6BSVAMx+gyHiPPeMKH0RnuVNcqe/SMXveWpanx+RCoaidcmxyrFZH8n2SfC5FVCt5YMol8zFPbeu+c1js/4/KOm273qdbBsw+EelGh1lKbwZa24rLUhDUm9WxDPR1ukAIOvxW+xQ40BmYikW2ewlrUMTwwgarA==\" }"
          }
        }
      }
      */

      if (paymentContainer.current) {
        checkout.create('dropin').mount(paymentContainer.current);
      }
    };

    createCheckout();

    // eslint-disable-next-line consistent-return
    return () => {
      hasRun = true;
    };
  }, []);

  return (
    <>
      <div ref={paymentContainer} />
    </>
  );
};

export default withRouter(AdyenForm);

//export default AdyenForm;

/*


class PaymentPage extends Component {
  constructor(props) {
    super(props);
    this.initAdyenCheckout = this.initAdyenCheckout.bind(this);
  }

  componentDidMount() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/3.0.0/adyen.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src =
      "https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/3.0.0/adyen.js";
    script.async = true;
    script.onload = this.initAdyenCheckout; // Wait until the script is loaded before initiating AdyenCheckout
    document.body.appendChild(script);
  }

  async initAdyenCheckout() {

    const session = await createPaymentSession();


    // You can add AdyenCheckout to your list of globals and then delete the window reference:
    // const checkout = new AdyenCheckout(configuration);

    const checkout = await AdyenCheckout({
      session,
      clientKey: ADYEN_CLIENT_KEY, // Web Drop-in versions before 3.10.1 use originKey instead of clientKey.
      paymentMethodsResponse: paymentMethodsMock,
      locale: 'en-US',
      environment: 'test',
    });


    // If you need to refer to the dropin externaly, you can save this inside a variable:
    // const dropin = checkout.create...
    checkout.create("dropin").mount(paymentContainer.current);
  }

  render() {
    return (
      <div
        ref={ref => {
          this.ref = ref;
        }}
      />
    );
  }
}

export default withRouter(PaymentPage);

*/



