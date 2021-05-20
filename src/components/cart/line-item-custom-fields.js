import { useEffect, useState } from 'react';
import config from '../../config';
import { callCT, requestBuilder } from '../../commercetools';

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
 
    let uri = requestBuilder
                .types
                .where('resourceTypeIds contains any ("line-item")').build();

    VERBOSE && console.log('Get types URI',uri);

    let res =  await callCT({
      uri: uri,
      method: 'GET'
    });
    if(res && res.body.results) {
      console.log('types',res.body.results);
      setTypes(res.body.results);
    }
  };

  console.log(typeId);
  let type=types.find(t => t.id == typeId)
  if(!type)
    return null;

  console.log('line item custom',lineItem.custom);
  
  return (
    <Container class="small">
      <Row><hr/></Row>
      <Row>
        <Col>
          Line Item Custom Fields
        </Col>
      </Row>
      <Row>
        <Col>Type: {type.name[config.locale]}</Col>
      </Row>
      { Object.entries(lineItem.custom.fields).map(([key,value]) => <LineItemCustomField id={key} name={key} value={value}/> ) }
    </Container>
    
  )
}

export default LineItemCustomFields;
