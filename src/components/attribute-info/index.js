// Only display selected attributes

const VERBOSE = false; 

const includeAttrs=['color','size']

const AttributeInfo = ({attr}) => {

  if(!includeAttrs.find(i => i==attr.name))
    return null;

  VERBOSE && console.log('attribute',attr);
  
  const name = attr.name;

  let value = attr.value;
  if(typeof value === 'object') {
    value = value.label;
    if(typeof value === 'object') {
      value=value.en;
    }
  }
  return (
    <span>&nbsp;{ name }={ value }</span>
  )
}

export default AttributeInfo

