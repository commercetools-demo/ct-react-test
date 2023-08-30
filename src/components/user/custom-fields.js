import { useEffect, useState } from 'react';
import config from '../../config';
import { apiRoot } from '../../commercetools';

import { Container, Row, Col} from 'react-bootstrap';
import CustomField from './custom-field';

const VERBOSE=true;

const CustomFields = ({customer}) => {

  if(!customer) {
    return null
  }
  
  let [types, setTypes] = useState([]);
  let [typeId, setTypeId] = useState(customer?.custom?.type?.id);
  let [fetched, setFetched] = useState(false);

  useEffect(() => {
    fetchTypes();
  });

  const fetchTypes = async () => {
    if(fetched)
      return;
    setFetched(true);
 
    let res =  await apiRoot
    .types()
    .get({ queryArgs: {
      where: 'resourceTypeIds contains any ("customer")',      
    }})
    .execute();

    if(res && res.body.results) {
      console.log('types',res.body.results);
      setTypes(res.body.results);
    }
  };

  console.log('custom type',typeId);
  let type=types.find(t => t.id == typeId)
  if(!type)
    return null;

  console.log('custom',customer.custom);
  
  return (
    <div className="small">
      <Container>
        <Row>
          <Col>
            <span className="heading">
              Custom Fields
            </span>
          </Col>
        </Row>
        <Row>
          <Col>Type: {type.name[config.locale]}</Col>
        </Row>
        { Object.entries(customer.custom?.fields).map(([key,value]) => <CustomField key={key} name={key} value={value}/> ) }
      </Container>
    </div>
    
  )
}

export default CustomFields;
