import { useContext, useState, useEffect } from 'react';
import { apiRoot } from '../../commercetools-ts';
import AppContext from '../../appContext';

function CountryPicker() {

  const [context, setContext] = useContext(AppContext);
  
  const onChangeCountry = (event) => {
      setContext({...context,country: event.target.value});
      sessionStorage.setItem('country',event.target.value);
  }

  let [countries, setCountries] = useState([]);

  useEffect(() => {
    fetchCountries();
  });

  async function fetchCountries()  {
    // Avoid repeat calls (?)
    if(countries.length) {
      return;
    }
 
    let res =  await apiRoot
      .get()
      .execute();

    if(res && res.body) {
      setCountries(res.body.countries);
    }
  };

  let countryOptions = "";
  if(countries.length) {
    countryOptions = countries.map(c => <option key={c} value={c}>{c}</option>);
   
  }

  let selected=context.country ? context.country : '';

  return (
    <div>
      Country:&nbsp;&nbsp;  
      <select value={selected} onChange={onChangeCountry}>
        <option value="">(none selected)</option>
        {countryOptions}
      </select>
    </div>
  );
      
}

export default CountryPicker;