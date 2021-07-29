import { Container, Row, Col} from 'react-bootstrap';
const VERBOSE=true;

const LineItemCustomField = ({name,value}) => {

  VERBOSE && console.log(name);
  VERBOSE && console.log(value);

  return (
    <Row><Col class="small">{name} : {value}</Col></Row>    
  )
}

export default LineItemCustomField;
