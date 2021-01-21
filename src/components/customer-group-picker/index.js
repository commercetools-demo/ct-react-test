import { useContext, useState, useEffect } from 'react';
import { callCT, requestBuilder } from '../../commercetools';
import AppContext from '../../appContext';

const VERBOSE = true;

function CustomerGroupPicker() {

  const [context, setContext] = useContext(AppContext);
  
  const onChangeCustomerGroup = (event) => {
    const customerGroupId = event.target.value;
    let customerGroupName = "";
    if(customerGroupId) {
      customerGroupName = customerGroups.find(c => c.id == customerGroupId).name;
    }
      setContext({...context, 
        customerGroup: customerGroupId, 
        customerGroupName: customerGroupName });
  }

  let [customerGroups, setCustomerGroups] = useState([]);

  useEffect(() => {
    fetchCustomerGroups();
  });

  async function fetchCustomerGroups()  {
    // Avoid repeat calls (?)
    if(customerGroups.length) {
      return;
    }
 
    let uri = requestBuilder.customerGroups.build();

   
    VERBOSE && console.log('Get customerGroups URI',uri);

    let res =  await callCT({
      uri: uri,
      method: 'GET'
    });
    if(res && res.body.results) {
      console.log('customerGroups',res.body.results);
      setCustomerGroups(res.body.results);
    }
  };

  let customerGroupOptions = "";
  if(customerGroups.length) {
    customerGroupOptions = customerGroups.map(c => <option key={c.id} value={c.id}>{c.name}</option>);
   
  }

  return (
    <div>
      Customer Group:&nbsp;&nbsp;  
      <select value={context.customerGroup} onChange={onChangeCustomerGroup}>
        <option value="">(none selected)</option>
        {customerGroupOptions}
      </select>
    </div>
  );
      
}

export default CustomerGroupPicker;