import config from '../../config';
import { useContext, useState, useEffect } from 'react';
import { apiRoot } from '../../commercetools';
import AppContext from '../../appContext';

const VERBOSE = true;

function AirlinePicker() {

  const [context, setContext] = useContext(AppContext);

  let [airlines, setAirlines] = useState([]);
  let [fetched, setFetched] = useState(false);

  const onChangeAirline = (event) => {
    const code = event.target.value;
    let obj = null;
    if(code) {
      obj = airlines.find(a => a.value?.code == code);
      if(obj) {
        setContext({...context,airlineCode: obj.value.code, airlineName: obj.value.name});
        return;
      }
    }
    setContext({...context,airlineCode: null, airlineName: ''});
  }
  
  useEffect(() => {
    fetchAirlines();
  });

  async function fetchAirlines()  {
    // Avoid repeat calls
    if(fetched) {
      return;
    }
    setFetched(true);
 

    let res =  await apiRoot
      .customObjects().withContainer({container: 'airline'})
      .get()
      .execute();
      
    if(res && res.body.results) {
      console.log('airlines',res.body.results);
      setAirlines(res.body.results);
    }
  };

  let options = "";
  if(airlines.length) {
    options = airlines.map(a => <option key={a.id} value={a.value.code}>{a.value.name}</option>);
  }

  let selectedAirline=context.airlineCode ? context.airlineCode : '';

  return (
    <div>
      Airline:&nbsp;&nbsp;  
      <select value={selectedAirline} onChange={onChangeAirline}>
        <option value="">(none selected)</option>
        {options}
      </select>
    </div>
  );
      
}

export default AirlinePicker;