import config from '../../config';


const AttributeInfo = ({attr}) => {
  
  const name = attr.name;

  let value = JSON.stringify(attr.value,null,'\t');
  console.log('attr value type', typeof attr.value);
  if(typeof attr.value === 'object' && attr.value.label !== undefined && typeof attr.value.label === 'object') {
    value = attr.value.label[config.locale];
  }
  if(typeof attr.value == 'boolean') {
    value = attr.value ? 'true' : 'false';
  }
  return (
    <span>&nbsp;{ name }: {value}<br></br></span>
  )
}

export default AttributeInfo

