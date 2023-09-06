import { useEffect, useState } from 'react';
import config from '../../config';
import { apiRoot } from '../../commercetools';

import { Container, Row, Col} from 'react-bootstrap';
import LineItemCustomField from './line-item-custom-field';

const VERBOSE=true;

const LineItemCustomFields = ({lineItem}) => {

  if(!lineItem) {
    return null
  }
  
  let [types, setTypes] = useState([]);
  let [typeId, setTypeId] = useState(lineItem?.custom?.type?.id);
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
      where: 'resourceTypeIds contains any ("line-item")',      
    }})
    .execute();

    if(res && res.body.results) {
      setTypes(res.body.results);
    }
  };

  let type=types.find(t => t.id == typeId)
  if(!type)
    return null;

  
  return (
    <div class="small">
      <Container>
        <Row>
          <Col>
            <span className="heading">
              Line Item Custom Fields
            </span>
          </Col>
        </Row>
        <Row>
          <Col>Type: {type.name[config.locale]}</Col>
        </Row>
        { Object.entries(lineItem.custom?.fields).map(([key,value]) => <LineItemCustomField key={key} name={key} value={value}/> ) }
      </Container>
    </div>
    
  )
}

export default LineItemCustomFields;
