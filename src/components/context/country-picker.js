import { useContext, useState, useEffect } from 'react';
import { callCT, requestBuilder } from '../../commercetools';
import AppContext from '../../appContext';

const VERBOSE = true;

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
 
    let uri = requestBuilder.project.build();
   
    VERBOSE && console.log('Get project URI',uri);

    let res =  await callCT({
      uri: uri,
      method: 'GET'
    });
    if(res && res.body) {
      setCountries(res.body.countries);
    }
  };

  let countryOptions = "";
  if(countries.length) {
    countryOptions = countries.map(c => <option key={c} value={c}>{c}</option>);
   
  }

  return (
    <div>
      Country:&nbsp;&nbsp;  
      <select value={context.country} onChange={onChangeCountry}>
        <option value="">(none selected)</option>
        {countryOptions}
      </select>
    </div>
  );
      
}

export default CountryPicker;