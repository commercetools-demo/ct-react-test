import axios from 'axios';
import { Component } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { withRouter } from "react-router";
import { zuora } from '../../config';
import ContextDisplay from '../context/context-display';

const VERBOSE=true;
const {
    accountId, 
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

  callback = (response) => {
    console.log('callback with response', response)
    if(response.success === 'true') {
      sessionStorage.setItem('paymentMethodId', response.refId);
      // create payment
      this.props.history.push('/order');
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
      .get(`${baseUrl}/api/account/session`);
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
      field_accountId: accountId,
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