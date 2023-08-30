import { Row, Col} from 'react-bootstrap';

const CustomField = ({name,value}) => {
  return (
    <Row><Col className="small">{name} : {value}</Col></Row>    
  )
}

export default CustomField;
