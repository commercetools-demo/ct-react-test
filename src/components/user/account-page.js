import { useContext, useEffect, useState } from 'react';
import AppContext from '../../appContext';
import { apiRoot, setAccessToken } from '../../commercetools';
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
    const accessToken = sessionStorage.getItem('accessToken');
    // Avoid repeat calls
    if(customer) {
      if(accessToken) {
        setAccessToken(accessToken);
      }

      return;
    }

    if(!customer && accessToken) {
      setAccessToken(accessToken);

        let res =  await apiRoot
          .me()
          .get()
          .execute();

      if(res?.body) {
        setCustomer(res.body);
        setContext({...context, loggedIn: true});
      }
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
        <div>
          <h5>Customer</h5>
          Customer Name:  {customer.firstName} {customer.lastName}      
        </div>
        <div>
          <CommercetoolsLogin/>
        </div>
      </div>
    )
  }
  return null;
}

export default AccountPage;
