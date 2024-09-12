import config from '../config';

export function formatPrice(price) {
  console.log('FORMAT PRICE',price);
  let value = price;
  if(price.value) {
    value = price.value;
  }
  return new Intl.NumberFormat(config.locale, 
    { style: 'currency',
      currency: value.currencyCode }).format(value.centAmount/100);
}

export function formatDiscount(discount) {
  const currency = sessionStorage.getItem('currency');
  console.log('FORMAT DISCOUNT',discount);
  if (discount.value.type === 'relative' && discount.value.permyriad) {
    return discount.value.permyriad / 100 + "%";
  }
  if (discount.value.type === 'absolute') {
    const money = discount.value.money.find(m => m.currencyCode === currency);
    if (money) {
      return formatPrice(money);
    }
  } 
  return 'unknown discount type';
}
