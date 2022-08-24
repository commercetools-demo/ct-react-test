import { useEffect, useContext, useState } from 'react';
import { apiRoot } from '../../commercetools';
import AppContext from '../../appContext';
import CommercetoolsLogin from './commercetools-login';
//import OktaLogin from './okta-login';
//import DummyLogin from './dummy-login';

const VERBOSE=true;

const AccountPage = () => {
  const [context] = useContext(AppContext);
  const [customer, setCustomer] = useState();

  useEffect(() => {
    fetchCustomer();
  });

    
  const fetchCustomer = async () => {
    console.log('fetch cust',customer);
    // Avoid repeat calls
    if(customer)
      return;

    let res =  await apiRoot
      .me()
      .get()
      .execute();

    if(res?.body) {
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
      </div>
    )
  }
  return null;
}

export default AccountPage;
