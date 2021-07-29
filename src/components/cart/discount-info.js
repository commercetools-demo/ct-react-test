import config from '../../config';
import LineItemPriceInfo from './line-item-price-info';

const VERBOSE=true;

const DiscountInfo = ({discount}) => {

  console.log(discount);

  if(!discount)
    return null;

  return (
    <div class="small">
        Name: { discount?.discount?.obj?.name[config.locale] } &nbsp;&nbsp;
        Discounted Amount:  <LineItemPriceInfo price={discount.discountedAmount}/>
    </div>
  );
}

export default DiscountInfo
