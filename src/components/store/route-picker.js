import config from '../../config';
import { useContext, useState, useEffect } from 'react';
import { apiRoot } from '../../commercetools';
import AppContext from '../../appContext';

const VERBOSE = true;

function RoutePicker() {

  const [context, setContext] = useContext(AppContext);

  let [routes, setRoutes] = useState([]);
  let [fetched, setFetched] = useState(false);

  const onChangeRoute = (event) => {
    const id = event.target.value;
    let name = "";
    if(id) {
      name = routes.find(a => a.id == id).value.name;
      setContext({...context,routeId: id, routeName: name});
    } else {
      setContext({...context,routeId: null, routeName: ''});
    }
  }
  useEffect(() => {
    fetchRoutes();
  });

  async function fetchRoutes()  {
    // Avoid repeat calls
    if(fetched) {
      return;
    }
    setFetched(true);
 

    let res =  await apiRoot
      .customObjects().withContainer({container: 'route'})
      .get()
      .execute();
      
    if(res && res.body.results) {
      console.log('routes',res.body.results);
      setRoutes(res.body.results);
    }
  };

  let options = "";
  if(routes.length) {
    options = routes.map(a => <option key={a.id} value={a.id}>{a.value.name}</option>);
  }

  let selectedRoute=context.routeId ? context.routeId : '';

  return (
    <div>
      Route:&nbsp;&nbsp;  
      <select value={selectedRoute} onChange={onChangeRoute}>
        <option value="">(none selected)</option>
        {options}
      </select>
    </div>
  );
      
}

export default RoutePicker;