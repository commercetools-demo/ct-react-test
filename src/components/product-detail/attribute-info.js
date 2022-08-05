import config from '../../config';


const AttributeInfo = ({attr}) => {
  
  const name = attr.name;

  let value = attr.value;
  console.log('attr value type',typeof value);
  if(typeof value === 'object') {
    value = value.label;
    if(typeof value === 'object') {
      value=value[config.locale];
    }
  }
  if(typeof value == 'boolean') {
    value = value ? 'true' : 'false';
  }
  return (
    <span>&nbsp;{ name }: {value}<br></br></span>
  )
}

export default AttributeInfo

