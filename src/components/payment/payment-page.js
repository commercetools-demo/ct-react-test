// @ts-check

import axios from 'axios';
import React, { Component } from "react";
import { withRouter } from "react-router";
import { useRef, useEffect } from 'react';

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

      const session = await axios.get(`${URL_APP}/api/sessions`);

      const checkout = await AdyenCheckout({
        session: session.data,
        clientKey: process.env.REACT_APP_ADYEN_CLIENT_KEY, // Web Drop-in versions before 3.10.1 use originKey instead of clientKey.
        locale: 'en-US',
        environment: 'test',
        paymentMethodsResponse: paymentMethodsMock,
      });

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



