import { useState } from 'react';
import config from '../../config';

const VERBOSE=true;

const CustomField = ({field,cart,onChange}) => {
  let value, setValue;
  if(cart.custom) {
    [value, setValue] = useState(cart?.custom?.fields[field.name]);
  } else {
    [value, setValue] = useState();
  }


  const change = (field,value) => {
    setValue(value);
    // notify parent
    onChange(field,value);
  }
  
  if(field.type.name=='Boolean') {
    return (
      <div style={"margin-top"="2px"}>
        <span>{field.label[config.locale]}</span> &nbsp; 
        <input type="checkbox"
              style={
                "margin-left": "0px",
                "margin-right":"6px",
                "padding":"6px",
                "width":"25px",
                "height":"25px",
                "vertical-align":"middle",
                "display":"inline-block",
                "margin-top":"-2px"
              }
              name={field.name}
              checked={value}
              onChange={event => change(field.name,event.target.checked)} 
        />
      </div>
    )
  }

  if(cart.custom?.fields?.[field.name] && field.type.name=='Set') {
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
