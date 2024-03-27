import { useContext, useState, useEffect } from 'react';
import { apiRoot } from '../../commercetools';
import { Container, Row, Col} from 'react-bootstrap';
import AppContext from '../../appContext';
import config from '../../config';

function StoreLookup() {

  const [context, setContext] = useContext(AppContext);

  let [message, setMessage] = useState();
  let [store, setStore] = useState();

  useEffect(() => {
    fetchStore();
  },[context.airlineCode, context.routeName]);

  async function fetchStore()  {
    console.log('store lookup');
    
    if(context.airlineCode && context.routeName) {
      const queryArgs = {
        where: `custom(fields(routes contains any ("${context.routeName}"))) and custom(fields(airline="${context.airlineCode}"))`        
      }
  
      let res =  await apiRoot
        .stores()
        .get({queryArgs})
        .execute();
        
      if(res && res.body.results) {
        console.log('stores',res.body.results);
        if(res.body.count==0) {
          setStore();
          setContext({...context,storeKey: null, storeName: null, rootCategory: null})
          setMessage('No stores found.');
        }
        if(res.body.count > 1) {
          setMessage('Multiple stores found based on selected criteria');
          return;
        }
        if(res.body.count==1) {
          const store = res.body.results[0];
          setStore(store);
          console.log('STORE',store);
          setContext({...context
            ,storeKey: store.key
            ,storeName: store.name[config.locale]
            ,rootCategory: store.custom?.fields?.rootCategory?.id
          })
          setMessage();
        }
      }
    }
  };
 
  return (
    <div>
      <Row>
        { message && (
          <span>Message: {message}</span>
        )}
      </Row>
      { store && (
        <Row>Store:&nbsp;
          { store.name[config.locale] }
        </Row>
      )}
    </div>
  );
}

export default StoreLookup;