import { useEffect, useState } from 'react';
import config from '../../config';
import { apiRoot } from '../../commercetools-ts';

import { Container, Row, Col} from 'react-bootstrap';
import CustomFieldsForm from './custom-fields-form';

const VERBOSE=true;

const CartCustomFields = ({cart, updateCart}) => {

  if(!cart) {
    return null
  }
  
  let [types, setTypes] = useState([]);
  let [typeId, setTypeId] = useState(cart?.custom?.type?.id);
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
      .get({queryArgs: {
        where: 'resourceTypeIds contains any ("order")'
      }})
      .execute();

    if(res && res.body.results) {
      console.log('types',res.body.results);
      setTypes(res.body.results);
    }
  };

  const onChangeType = (event) => {
    setTypeId(event.target.value);
  }

  let typeOptions = "";
  if(types.length) {
    typeOptions = types.map(t => <option key={t.id} value={t.id}>{t.name[config.locale]}</option>);
  }

  console.log(typeId);
  let type=types.find(t => t.id == typeId)
  
  return (
    <Container>
      <Row>
        <Col>
          Cart Custom Fields &nbsp;
          <select value={typeId}  onChange={onChangeType}>
            <option value="">(none selected)</option>
            {typeOptions}
          </select>
          <CustomFieldsForm type={type} cart={cart} updateCart={updateCart} />
        </Col>
      </Row>
      <Row><Col></Col></Row>
    </Container>
    
  )
}

export default CartCustomFields;
