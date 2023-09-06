import { Container, Row, Col} from 'react-bootstrap';
const VERBOSE=true;

const LineItemCustomField = ({name,value}) => {

  return (
    <Row><Col class="small">{name} : {value}</Col></Row>    
  )
}

export default LineItemCustomField;
