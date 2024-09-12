import config from "../../config";
import { formatDiscount, formatPrice } from '../../util/priceUtil';

const VERBOSE=true;

const LineItemPriceInfo = ({price}) => {

  console.log('price',price);
  if(!price) {
    return <span>n/a</span>;
  }

  return(
      <span>
      {
        price.discounted ?
            <span>
              <strike>{formatPrice(price)}</strike> {formatPrice(price.discounted)}<br/>
              <span class="small">
                <em>{formatDiscount(price.discounted.discount.obj)} off</em><br/>
                Product Discount Name:<br/> {price.discounted.discount.obj.name[config.locale]}
              </span>
            </span>
            :
            <span>{formatPrice(price)}</span>
      }
      </span>
  )
}

export default LineItemPriceInfo
