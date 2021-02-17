import DiscountInfo from './discount-info';
import LineItemPriceInfo from './line-item-price-info';


const VERBOSE=true;

const LineItemInfo = ({lineItem,increment,decrement}) => {

  VERBOSE && console.log('lineItem',lineItem);
  

  return (
    <li>
        Quantity:&nbsp;&nbsp; 
          <button onClick={decrement}> - </button>&nbsp;
          { lineItem.quantity }&nbsp;
          <button onClick={increment}> + </button> <br></br>
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
        {
          lineItem.discountedPricePerQuantity.length ? 
          <small>Discounted price per quantity
          <ul>
          { lineItem.discountedPricePerQuantity.map((item) => (
            <span>qty: {item.quantity}: 
            <LineItemPriceInfo price={item.discountedPrice}/><br></br>
            { item.discountedPrice.includedDiscounts.map((discount,index) => <DiscountInfo key={index} discount={discount}/>)}
            </span> ))
          }
          </ul>
          </small>
          : <br></br>
        }
        <p></p>
    </li>
  );
}
//             

export default LineItemInfo
