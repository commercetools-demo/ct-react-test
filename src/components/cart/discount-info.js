import config from '../../config';
import LineItemPriceInfo from './line-item-price-info';

const DiscountInfo = ({discount}) => {

  if(!discount)
    return null;

  return (
    <div class="small">
        Discount Name: { discount?.discount?.obj?.name[config.locale] } &nbsp;&nbsp;
        Discounted Amount:  <LineItemPriceInfo price={discount.discountedAmount}/>
    </div>
  );
}

export default DiscountInfo
