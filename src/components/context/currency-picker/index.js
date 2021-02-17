import { useState, useEffect } from 'react';
import { callCT, requestBuilder } from '../../../commercetools';

const VERBOSE = true;

function CurrencyPicker() {

  let currency = sessionStorage.getItem('currency');

  const onChangeCurrency = (event) => {
    sessionStorage.setItem('currency',event.target.value);
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
 
    let uri = requestBuilder.project.build();
   
    VERBOSE && console.log('Get project URI',uri);

    let res =  await callCT({
      uri: uri,
      method: 'GET'
    });
    if(res && res.body) {
      setCurrencies(res.body.currencies);
    }
  };

  let currencyOptions = "";
  if(currencies.length) {
    currencyOptions = currencies.map(c => <option key={c} value={c}>{c}</option>);
   
  }

  return (
    <div>
      Currency:&nbsp;&nbsp;  
      <select value={currency} onChange={onChangeCurrency}>
        <option value="">(none selected)</option>
        {currencyOptions}
      </select>
    </div>
  );
      
}

export default CurrencyPicker;