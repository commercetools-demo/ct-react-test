import config from '../../config';
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


  return (
    <tr>
      <td>{price.value.currencyCode}</td>
      <td>{price.country}</td>
      <td>{channelName}</td>
      <td>{customerGroup}</td>
      <td>{price.value.centAmount/100}</td>
    </tr>
  );
}

export default PriceInfo
