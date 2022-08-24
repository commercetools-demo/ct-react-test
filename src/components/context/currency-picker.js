import { useContext, useState, useEffect } from 'react';
import { apiRoot } from '../../commercetools';
import AppContext from '../../appContext';

const VERBOSE = true;

function CurrencyPicker() {

  const [context, setContext] = useContext(AppContext);

  // Set both context (for application state) and session (for refreshes)
  const onChangeCurrency = (event) => {
    const curr=event.target.value;
    setContext({...context,currency: curr })
    sessionStorage.setItem('currency',curr);
  }

  let [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    fetchCurrencies();
  });

  async function fetchCurrencies()  {
    // Avoid repeat calls (?)
    if(currencies.length) {
      return;
    }
 
    let res =  await apiRoot
    .get()
    .execute();
    
    if(res && res.body) {
      setCurrencies(res.body.currencies);
    }
  };

  let currencyOptions = "";
  if(currencies.length) {
    currencyOptions = currencies.map(c => <option key={c} value={c}>{c}</option>);
   
  }
  let currency = context.currency;

  return (
    <div>
      Currency:&nbsp;&nbsp;  
      <select value={currency ? currency : ''} onChange={onChangeCurrency}>
        <option value="">(none selected)</option>
        {currencyOptions}
      </select>
    </div>
  );
      
}

export default CurrencyPicker;