import config from '../../config';
import { useContext, useState, useEffect } from 'react';
import { apiRoot } from '../../commercetools';
import AppContext from '../../appContext';

function StorePicker() {

  const [context, setContext] = useContext(AppContext);
  
  const onChangeStore = (event) => {
    const key = event.target.value;
    let storeName = "";
    if(key) {
      storeName = stores.find(s => s.key == key).name[config.locale];
      setContext({...context,storeKey: key, storeName: storeName})
      sessionStorage.setItem('storeKey',key);
      sessionStorage.setItem('storeName',storeName);
    } else {
      setContext({...context,storeKey: null, storeName: null});
      sessionStorage.removeItem('storeKey');
      sessionStorage.removeItem('storeName');
    }
  }

  let [fetched, setFetched] = useState(false);
  let [stores, setStores] = useState([]);

  useEffect(() => {
    fetchStores();
  });

  async function fetchStores()  {
    // Avoid repeat calls (?)
    if(fetched) {
      return;
    }
    setFetched(true);

    let res =  await apiRoot
      .stores()
      .get({
        queryArgs: {
          limit: 200,
          sort: `name.${config.locale} asc`
        }
      })
      .execute();

    if(res?.body?.results) {
      console.log('stores',res.body.results);
      setStores(res.body.results);
    }
  };

  let storeOptions = "";
  if(stores.length) {
    storeOptions = stores.map(s => <option key={s.key} value={s.key}>{s.name[config.locale]}</option>);
  }

  const storeKey=context.storeKey ? context.storeKey : '';

  return (
    <div>
      Store:&nbsp;&nbsp;  
      <select value={storeKey} onChange={onChangeStore}>
        <option value="">(none selected)</option>
        {storeOptions}
      </select>
    </div>
  );
      
}

export default StorePicker;