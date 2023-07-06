import axios from 'axios';
import { Component } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { withRouter } from "react-router";
import { apiRoot } from '../../commercetools';
import { zuora } from '../../config';
import { getCart, updateCart } from '../../util/cart-util';
import ContextDisplay from '../context/context-display';

const VERBOSE=true;
const {
    username,
    password,
    payment_page_url,
    baseUrl
  } = zuora;
  const pmamount = '1';

class PaymentPage extends Component {
  state = {
    paymentError: null,
    isPaymentGatewayLoading: true,
  }

  constructor(props) {
    super(props);

    this.renderPaymentPage();
  }

  SAFE_componentWillMount() {
    this.errorMessageCallback = this.errorMessageCallback.bind(this);
    this.callback = this.callback.bind(this);
    this.onloadCallback = this.onloadCallback.bind(this);
  }

  onloadCallback = () => {
    console.log('onloadCallback')
    this.setState({ isPaymentGatewayLoading: false });
  }

  callback = async (response) => {
    console.log('callback with response', response)
    if(response.success === 'true') {
      sessionStorage.setItem('paymentMethodId', response.refId);
      const cart = await getCart();
      const paymentRes = await apiRoot.payments().post({
        body: {
          amountPlanned : {
            currencyCode: cart.totalPrice.currencyCode,
            centAmount : cart.totalPrice.centAmount
          },
          paymentMethodInfo : {
            paymentInterface : "ADYEN",
            method : "CREDIT_CARD",
            name : {
              en : "Credit Card"
            }
          },
          custom: {
            type: {
              key: "payment-zuoraPaymentMethodReference",
              typeId: "type"
            },
            fields: {
              zuoraPaymentMethodReference: {
                "en-US": response.refId,
                "de-DE": response.refId
              }
            }
          }
        }
      }).execute()

      console.log('paymentRes', paymentRes)

      const cartWithPayment = await updateCart([{
        action: 'addPayment',
        payment: {
          id: paymentRes.body.id,
          typeId: "payment"
        }
      }]);

      const order = await apiRoot
        .orders()
        .post({         
          body: {
            cart: {
              id: cartWithPayment.id
            },
            version: cartWithPayment.version,
          }
      })
      .execute();

      if(order) {
        sessionStorage.setItem('orderId',order.body.id);
        console.log('Order',order.body);
        this.props.history.push('/order');
      }
    }
  }

  errorMessageCallback = (key, code, message) => {
    console.log('error!', key)
    console.log('error code!', code);
    console.log('error message', message);

    this.setState({ paymentError: message });
  }

  getToken = async () => {
    // Fields for on session payments
    // const integrationType = '';
    /*const request = {
      pageid: pageId,
      uri: payment_page_url,
      currency: 'USD',
      accountid: accountId,
      integrationtype: integrationType,
      pmamount
    };*/

    const {data} = await axios
      .get(`${baseUrl}/api/ct-poc/account/session`, {
        headers: {
          'Authorization': `Basic ${
            Buffer.from(
              `${username}:${password}`
            ).toString("base64")
          }`
        }
      });

      return data;
  };

  /*getPrepopulateFields = async () => {
    const request = {
      env: name
    };
​
    const {data} = await axios
      .post(`${baseUrl}/payment_page/prepopulated-fields`, request);
​
    return data?.prepopulateFields
​
  }*/

  renderPaymentPage = async () => {
    const data = await this.getToken();
    // const prepopulateFields = await this.getPrepopulateFields();
    const gtOptions = ['Option:Value'];
    const Z = window.Z;
    const params = {
      field_achBankABACode: "",
      field_achBankAccountNumber: "",
      field_bankAccountName: "",
      field_bankAccountNumber: "",
      field_creditCardExpirationMonth: "",
      field_creditCardExpirationYear: "",
      field_creditCardNumber: "",
      token: data.token.token,
      signature: data.token.signature,
      key: data.token.key,
      tenantId: data.token.tenantId,
      id: data.pageId,
      param_supportedTypes: 'AmericanExpress,JCB,Visa,MasterCard,Discover,Dankort',
      url: payment_page_url,
      locale: 'en',
      paymentGateway: '',
      authorizationAmount: pmamount,
      style: 'inline',
      submitEnabled: 'true'
    };

    gtOptions.forEach((gtOption) => {
        let ref = gtOption.split(":");
        let pass = "param_gwOptions_" + ref[0];
        params[pass] = ref[1];
    });

    Z.setEventHandler("onloadCallback", (...args) => {
      this.onloadCallback(...args)
    });

    Z.renderWithErrorHandler(
      params,
      {},
      (...args) => {
        this.callback(...args)
      },
      (...args) => {
        this.errorMessageCallback(...args)
      }
    );
  };

  render() { 
    return (
          <div>
      <ContextDisplay />
      
      <Container fluid>
        <Row>
          <Col>
            <h4>Payment</h4>
            {this.state.paymentError}
            {this.state.isPaymentGatewayLoading === true && 
              <div> 
                <label>Loading payment gateway......</label>
              </div>
            }
            <div id="zuora_payment" className="container container-center"></div>
            <div id="checkBoxDiv" className="item" hidden></div>
          </Col>
        </Row>
      </Container>         
    </div>
    )
  }
}

export default withRouter(PaymentPage);