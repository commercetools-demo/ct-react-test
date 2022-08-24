import { useState } from 'react';
import config from '../../config';

const VERBOSE=true;

const CustomField = ({field,cart,onChange}) => {
  console.log('field',cart.custom.fields[field.name]);

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

  if(field.type.name=='Set') {
    return (
      <div>
        <span><b>{field.name}:</b>  {cart.custom.fields[field.name].join(',')}</span>
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
