import { useState, useEffect } from 'react';
import { callCT, requestBuilder } from '../../commercetools';

const VERBOSE = true;

function CustomerGroupPicker() {
  
  const onChangeCustomerGroup = (event) => {
    const customerGroupId = event.target.value;
    if(customerGroupId) {
      sessionStorage.setItem('customerGroupId',customerGroupId); 
      const customerGroupName = customerGroups.find(c => c.id == customerGroupId).name;
      sessionStorage.setItem('customerGroupName',customerGroupName); 
    } else {
      sessionStorage.removeItem('customerGroupId');
      sessionStorage.removeItem('customerGroupName');
    }
  }

  const customerGroupId=sessionStorage.getItem('customerGroupid');

  let [customerGroups, setCustomerGroups] = useState([]);
  let [fetched, setFetched] = useState([]);

  useEffect(() => {
    fetchCustomerGroups();
  });

  async function fetchCustomerGroups()  {
    // Avoid repeat calls
    if(fetched) {
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
      setFetched(true);
    }
  };

  let customerGroupOptions = "";
  if(customerGroups.length) {
    customerGroupOptions = customerGroups.map(c => <option key={c.id} value={c.id}>{c.name}</option>);
   
  }

  return (
    <div>
      Customer Group:&nbsp;&nbsp;  
      <select value={customerGroupId} onChange={onChangeCustomerGroup}>
        <option value="">(none selected)</option>
        {customerGroupOptions}
      </select>
    </div>
  );
      
}

export default CustomerGroupPicker;