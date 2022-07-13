import { useContext, useState, useEffect } from 'react';
import { callCT, requestBuilder } from '../../commercetools';
import AppContext from '../../appContext';

const VERBOSE = true;

function CustomerGroupPicker() {

  console.log('Customer Group Picker');
  const [context, setContext] = useContext(AppContext);
  
  const onChangeCustomerGroup = (event) => {
    const customerGroupId = event.target.value;
    if(customerGroupId) {
      const customerGroupName = customerGroups.find(c => c.id == customerGroupId).name;

      setContext({
        ...context,
        customerGroupId:customerGroupId, 
        customerGroupName: customerGroupName
      });
      sessionStorage.setItem('customerGroupId',customerGroupId); 
      sessionStorage.setItem('customerGroupName',customerGroupName); 
    } else {setContext({
      ...context,
      customerGroupId:null, 
      customerGroupName: null
    });
      sessionStorage.removeItem('customerGroupId');
      sessionStorage.removeItem('customerGroupName');
    }
  }


  let [customerGroups, setCustomerGroups] = useState([]);
  let [cgFetched, setCGFetched] = useState(false);

  useEffect(() => {
    fetchCustomerGroups();
  });

  async function fetchCustomerGroups()  {
    console.log('Fetch Cust Group');
    // Avoid repeat calls
    if(cgFetched) {
      console.log('CG Already Fetched');
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
      setCGFetched(true);
    }
  };

  let customerGroupOptions = "";
  if(customerGroups.length) {
    customerGroupOptions = customerGroups.map(c => <option key={c.id} value={c.id}>{c.name}</option>);
   
  }

  const selected= context.customerGroupId ? context.customerGroupId : '';

  return (
    <div>
      Customer Group:&nbsp;&nbsp;  
      <select value={selected} onChange={onChangeCustomerGroup}>
        <option value="">(none selected)</option>
        {customerGroupOptions}
      </select>
    </div>
  );
      
}

export default CustomerGroupPicker;