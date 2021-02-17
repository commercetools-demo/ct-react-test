const VERBOSE=true;

const LineItemPriceInfo = ({price}) => {

  console.log('priceInfo',price);
  if(!price)
    return <span>n/a</span>;

  if(price.value)
    price=price.value;

  
  let value=(price.centAmount/100).toFixed(2);
  return(
    <span>${value}</span>
  )
}

export default LineItemPriceInfo
