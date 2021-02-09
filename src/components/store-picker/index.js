import { useContext, useState, useEffect } from 'react';
import { callCT, requestBuilder } from '../../commercetools';
import AppContext from '../../appContext';

const VERBOSE = true;

function StorePicker() {

  const [context, setContext] = useContext(AppContext);
  
  const onChangeStore = (event) => {
    const key = event.target.value;
    let storeName = "";
    if(key) {
      storeName = stores.find(s => s.key == key).name.en;
    }
    setContext({...context, 
      store: key, 
      storeName: storeName });
  }

  let [stores, setStores] = useState([]);

  useEffect(() => {
    fetchStores();
  });

  async function fetchStores()  {
    // Avoid repeat calls (?)
    if(stores.length) {
      return;
    }
 
    let uri = requestBuilder.stores.build()+'?limit=200&sort=name.en asc';

    VERBOSE && console.log('Get stores URI',uri);

    let res =  await callCT({
      uri: uri,
      method: 'GET'
    });
    if(res && res.body.results) {
      console.log('stores',res.body.results);
      setStores(res.body.results);
    }
  };

  let storeOptions = "";
  if(stores.length) {
    storeOptions = stores.map(s => <option key={s.key} value={s.key}>{s.name.en}</option>);
  }

  return (
    <div>
      Store:&nbsp;&nbsp;  
      <select value={context.store} onChange={onChangeStore}>
        <option value="">(none selected)</option>
        {storeOptions}
      </select>
    </div>
  );
      
}

export default StorePicker;