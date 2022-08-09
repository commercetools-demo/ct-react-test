import config from '../config';

export function formatPrice(price) {
  let value = price;
  if(price.value) {
    value = price.value;
  }
  return new Intl.NumberFormat(config.locale, 
    { style: 'currency',
      currency: value.currencyCode }).format(value.centAmount/100);
}