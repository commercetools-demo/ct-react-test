import config from '../../config';

const VERBOSE=true;

const DiscountInfo = ({discount}) => {

  console.log('discount',discount);

  return (
    <li>
        Name: { discount.discount.obj.name[config.locale] } &nbsp;&nbsp;
        Discounted Amount:  { discount.discountedAmount.centAmount/100 }
    </li>
  );
}

export default DiscountInfo
