
const VERBOSE=true;

const LineItemCustomField = ({name,value}) => {

  VERBOSE && console.log(name);
  VERBOSE && console.log(value);

  return (
    <span>{name} : {value} </span>    
  )
}

export default LineItemCustomField;
