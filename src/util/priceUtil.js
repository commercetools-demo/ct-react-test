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

export function formatDiscount(discount) {
  if (discount.value.type === 'relative' && discount.value.permyriad) {
    return discount.value.permyriad / 100 + "%";
  }
  return discount.value;
}
