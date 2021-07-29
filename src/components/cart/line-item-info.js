import config from '../../config';
import DiscountInfo from './discount-info';
import LineItemPriceInfo from './line-item-price-info';
import LineItemCustomFields from './line-item-custom-fields';
import { Container, Row, Col} from 'react-bootstrap';

const VERBOSE=true;

const LineItemInfo = ({lineItem,increment,decrement}) => {

  VERBOSE && console.log('lineItem',lineItem);
  

  return (
    <div>
      <Row>
        <Col>
            <button onClick={decrement}> - </button>&nbsp;
            { lineItem.quantity }&nbsp;
            <button onClick={increment}> + </button>
        </Col>
        <Col>
          {lineItem.name[config.locale] }
        </Col>
        <Col>
          <LineItemPriceInfo price={lineItem.price.value}/>
        </Col>
        <Col>
          {
            lineItem.discountedPricePerQuantity.length == 0 ?
            <span>N/A</span>
            : lineItem.discountedPricePerQuantity.length == 1 ?
              <LineItemPriceInfo price={lineItem.discountedPricePerQuantity[0].discountedPrice}/>
              : lineItem.discountedPricePerQuantity.map((item) => (
                <span>{item.quantity} @ <LineItemPriceInfo price={item.discountedPrice}/><br></br></span>
              ))
          }
        </Col>
        <Col>
          <LineItemPriceInfo price={lineItem.totalPrice}/>
        </Col>
        </Row>
    
     
      <Row>
        <Col>
          <span class="small">
            {
              lineItem.discountedPricePerQuantity.length ? 
              <div>
                <span class="heading">Discounted Price per Quantity</span>
                <ul>
                { lineItem.discountedPricePerQuantity.map((item) => (
                  <li>qty: {item.quantity} @ <LineItemPriceInfo price={item.discountedPrice}/>
                  { item.discountedPrice.includedDiscounts.map((discount,index) => <DiscountInfo key={index} discount={discount}/>)}
                  </li> ))
                }
                </ul>
              </div>
              : 
                <span>no discounts</span>
            }
          </span>
        </Col>
      </Row>
      <Row>
        <LineItemCustomFields lineItem={lineItem}/>
      </Row>
        <hr></hr>
      </div>
  );
}
//             

export default LineItemInfo
