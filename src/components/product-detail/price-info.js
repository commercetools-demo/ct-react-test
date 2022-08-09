import config from '../../config';
import { formatPrice } from '../../util/priceUtil';

const VERBOSE=false;

const PriceInfo = ({price}) => {
  VERBOSE && console.log('price:',price);

  let channelName = '';
  if(price.channel && price.channel.obj && price.channel.obj.name) {
    channelName=price.channel.obj.name[config.locale];
  }

  let customerGroup = '';
  if(price.customerGroup && price.customerGroup.obj && price.customerGroup.obj.name) {
    customerGroup=price.customerGroup.obj.name;
  }

  const priceStr = formatPrice(price);

  return (
    <tr>
      <td>{price.value.currencyCode}</td>
      <td>{price.country}</td>
      <td>{channelName}</td>
      <td>{customerGroup}</td>
      <td>{priceStr}</td>
    </tr>
  );
}

export default PriceInfo
