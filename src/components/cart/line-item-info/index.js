import DiscountInfo from '../discount-info';
import LineItemPriceInfo from '../line-item-price-info';


const VERBOSE=true;

const LineItemInfo = ({lineItem}) => {

  VERBOSE && console.log('lineItem',lineItem);
  

  return (
    <li>
        Quantity: { lineItem.quantity } &nbsp;&nbsp;
        Name:  { lineItem.name.en }&nbsp;&nbsp;
        
        Original Price: <LineItemPriceInfo price={lineItem.price.value}/>&nbsp;&nbsp;
        Discounted Price: <LineItemPriceInfo price={lineItem.discountedPrice}/>&nbsp;&nbsp;
        Total: <LineItemPriceInfo price={lineItem.totalPrice}/><br></br>
        { lineItem.discountedPrice && lineItem.discountedPrice.includedDiscounts.length > 0 ? 
          <small>Discounts:
          <ul>
          { lineItem.discountedPrice.includedDiscounts.map((discount,index) => <DiscountInfo key={index} discount={discount}/>)}
          </ul>
          </small>
          :
          <small>no discounts</small>
        }
        <p></p>
    </li>
  );
}

export default LineItemInfo
