import { formatPrice } from '../../util/priceUtil';

const VERBOSE=true;

const LineItemPriceInfo = ({price}) => {

  console.log('price',price);
  if(!price)
    return <span>n/a</span>;

  const priceStr = formatPrice(price);
  
  return(
    <span>{priceStr}</span>
  )
}

export default LineItemPriceInfo
