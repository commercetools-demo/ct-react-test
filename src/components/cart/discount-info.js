import config from '../../config';
import LineItemPriceInfo from './line-item-price-info';

const DiscountInfo = ({discount}) => {

  console.log(discount);

  if(!discount)
    return null;

  
  let discountName;
  console.log('DISCOUNT TYPE',discount.typeId);
  if(discount.discount.typeId == 'direct-discount') {
    discountName = '(direct)'
  } else {
    discountName = discount?.discount?.obj?.name[config.locale]
  }

  return (
    <div className="small">
        Discount: { discountName } &nbsp;&nbsp;
        Discounted Amount:  <LineItemPriceInfo price={discount.discountedAmount}/>
    </div>
  );
}

export default DiscountInfo
