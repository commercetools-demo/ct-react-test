import config from '../../config';
import DiscountInfo from './discount-info';
import LineItemPriceInfo from './line-item-price-info';
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
        <LineItemPriceInfo price={lineItem.discountedPrice}/>
      </Col>
      <Col>
        <LineItemPriceInfo price={lineItem.totalPrice}/>
      </Col>
      </Row>
      <Row>
        <Col md="6">
        { lineItem.discountedPrice && lineItem.discountedPrice.includedDiscounts.length ? 
          <small>Discounts:
          <ul>
          { lineItem.discountedPrice.includedDiscounts.map((discount,index) => <DiscountInfo key={index} discount={discount}/>)}
          </ul>
          </small>
          :
          <small>no discounts</small>
        }
        {
          lineItem.discountedPricePerQuantity.length ? 
          <small>Discounted price per quantity:
          <ul>
          { lineItem.discountedPricePerQuantity.map((item) => (
            <span>qty: {item.quantity}: 
            <LineItemPriceInfo price={item.discountedPrice}/>
            { item.discountedPrice.includedDiscounts.map((discount,index) => <DiscountInfo key={index} discount={discount}/>)}
            </span> ))
          }
          </ul>
          </small>
          : <span>&nbsp;</span>
        }
        </Col>
    </Row>
    </div>
  );
}
//             

export default LineItemInfo
