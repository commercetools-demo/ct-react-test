import config from '../../config';
import { useContext, useState, useEffect } from 'react';
import { apiRoot } from '../../commercetools';
import AppContext from '../../appContext';

const VERBOSE = true;

function FlightPicker() {

  const [context, setContext] = useContext(AppContext);

  let [flights, setFlights] = useState([]);
  let [fetched, setFetched] = useState(false);

  const onChangeFlight = (event) => {
    const id = event.target.value;
    let name = "";
    if(id) {
      name = flights.find(a => a.id == id).value.name;
      setContext({...context,flightId: id, flightName: name});
    } else {
      setContext({...context,flightId: null, flightName: ''});
    }
  }
  useEffect(() => {
    fetchFlights();
  });

  async function fetchFlights()  {
    // Avoid repeat calls
    if(fetched) {
      return;
    }
    setFetched(true);
 

    let res =  await apiRoot
      .customObjects().withContainer({container: 'flight'})
      .get()
      .execute();
      
    if(res && res.body.results) {
      console.log('flights',res.body.results);
      setFlights(res.body.results);
    }
  };

  let options = "";
  if(flights.length) {
    options = flights.map(a => <option key={a.id} value={a.id}>{a.value.name}</option>);
  }

  let selectedFlight=context.flightId ? context.flightId : '';

  return (
    <div>
      Flight:&nbsp;&nbsp;  
      <select value={selectedFlight} onChange={onChangeFlight}>
        <option value="">(none selected)</option>
        {options}
      </select>
    </div>
  );
      
}

export default FlightPicker;