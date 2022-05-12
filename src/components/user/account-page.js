import { useEffect, useContext, useState } from 'react';
import { callCT, requestBuilder } from '../../commercetools';
import AppContext from '../../appContext';
import { Container, Row, Col} from 'react-bootstrap';
import CommercetoolsLogin from './commercetools-login';
//import OktaLogin from './okta-login';
//import DummyLogin from './dummy-login';

const VERBOSE=true;

const AccountPage = () => {

  const [context, setContext] = useContext(AppContext);
  const [customer, setCustomer] = useState();

  useEffect(() => {
    fetchCustomer();
  });

    
  const fetchCustomer = async () => {
    console.log('fetch cust',customer);
    // Avoid repeat calls
    if(customer)
      return;

    let res =  await callCT({
      uri: requestBuilder.myProfile.build() + '?expand=custom.fields.profiles[*]',
      method: 'GET'
    });
    if(res && res.body) {
      setCustomer(res.body);
    }
  };

  if(!context.loggedIn) {
    return (
      <div>
        <CommercetoolsLogin/>
      </div>
    )
  }

  if(customer) {
    return (
      <div>
        <h5>Customer</h5>
        Customer Name:  {customer.firstName} {customer.lastName}
        <br/>
        Profiles:
        { 
          customer.custom?.fields?.profiles?.map((profile,index) => 
            <Row>
              <Col>{profile.obj.firstName} {profile.obj.lastName}</Col>
            </Row>
          )        
        }
        <Container>
          <Row>

          </Row>
        </Container>
      </div>
    )
  }
  return null;
}

export default AccountPage;
