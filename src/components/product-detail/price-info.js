import config from '../../config';
import {formatDiscount, formatPrice } from '../../util/priceUtil';
import {Link} from "react-router-dom";

const VERBOSE=false;

const PriceInfo = ({price}) => {
  VERBOSE && console.log('price:',price);

  if(!price)
    return '';

  let channelName = '';
  if(price.channel && price.channel.obj && price.channel.obj.name) {
    channelName=price.channel.obj.name[config.locale];
  }

  let customerGroup = '';
  if(price.customerGroup && price.customerGroup.obj && price.customerGroup.obj.name) {
    customerGroup=price.customerGroup.obj.name;
  }

  let priceStr = formatPrice(price);
  if(price.discounted) {
    priceStr = formatPrice(price.discounted);
  }

  return (
    <table>
      <tbody>
        <tr>
          <td>{price.value.currencyCode}</td>
          <td>{price.country}</td>
          <td>{channelName}</td>
          <td>{customerGroup}</td>
          <td>{priceStr}</td>
          <td>{ price.discounted &&
                <span>
                    <strike>{formatPrice(price)}</strike> {formatPrice(price.discounted)} <em>{formatDiscount(price.discounted.discount.obj)} off</em><br/>
                    Discount: <Link to={"/discount-detail/"+price.discounted.discount.id}>{price.discounted.discount.obj.name[config.locale]}</Link>
                </span>
              }
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default PriceInfo
