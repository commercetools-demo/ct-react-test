import { useEffect, useState } from 'react';
import { Container} from 'react-bootstrap';
import CustomField from './custom-field';

const VERBOSE=true;

const CustomFieldsForm = ({type, cart, updateCart}) => {
  console.log(type);

  if(!type)
    return null;
  
  let [fields] = useState({});
  
  const updateField = (field,value) => {
    console.log('update',field,value);
    fields[field]=value;
  }

  const saveCustom = () => {
    let actions=[];
    if(cart.custom && cart.custom.type.id==type.id) {
      for(let f of Object.keys(fields)) {
        actions.push({
          action: 'setCustomField',
          name: f,
          value: fields[f]
        })
      }
    } else {
      let action = {
        action: 'setCustomType',
        type: {
          id: type.id,
          typeId: 'type'
        },
        fields: fields
      }
      actions[0]=action;
    }
    updateCart(actions);
  }
  
  return (
    <Container>
      { type.fieldDefinitions.map((f,i) => <CustomField key={i} field={f} cart={cart} onChange={updateField} />) }
      <button type="button" onClick={saveCustom}>Save</button>
    </Container>
    
  )
}

export default CustomFieldsForm;
