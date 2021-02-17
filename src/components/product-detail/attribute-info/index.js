// Only display selected attributes

const VERBOSE = false; 


const AttributeInfo = ({attr}) => {
  
  const name = attr.name;

  let value = attr.value;
  if(typeof value === 'object') {
    value = value.label;
    if(typeof value === 'object') {
      value=value.en;
    }
  }
  return (
    <span>&nbsp;{ name }={ value }<br></br></span>
  )
}

export default AttributeInfo

