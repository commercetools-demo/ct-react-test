import { useEffect, useState } from 'react';
import config from '../../config';
import { callCT, requestBuilder } from '../../commercetools';

import { Container, Row, Col} from 'react-bootstrap';

const VERBOSE=true;

const CustomField = ({field,cart,onChange}) => {
  console.log(field);

  let [value, setValue] = useState(cart?.custom?.fields[field.name]);

  const change = (field,value) => {
    setValue(value);
    // notify parent
    onChange(field,value);
  }
  
  if(field.type.name=='Boolean') {
    return (
      <div>
        <span>{field.label[config.locale]}</span> &nbsp; 
        <input type="checkbox" 
              name={field.name}
              checked={value}
              onChange={event => change(field.name,event.target.checked)} 
        />
      </div>
    )
  }

  return (
    <div>
      <span>{field.label[config.locale]}</span> &nbsp; 
      <input onChange={event => change(field.name,event.target.value)}
             value={value} 
             name={field.name} 
      />      
    </div>
    
  )
}

export default CustomField;
