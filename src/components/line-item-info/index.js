import { useState, useEffect } from 'react';
import { callCT, requestBuilder } from '../../commercetools';

const VERBOSE=true;

const LineItemInfo = ({lineItem}) => {

  VERBOSE && console.log('lineItem',lineItem);
  let discounts=[];
  if(lineItem.discountedPrice) {
    for(let d of lineItem.discountedPrice.includedDiscounts) {
      discounts.push(d.discount.obj.name.en + ' --- amount off: ' + d.discountedAmount.centAmount/100);
    }
  }
  discounts = discounts.join(',');

  return (
    <li>
        Quantity: { lineItem.quantity } &nbsp;&nbsp;
        Name:  { lineItem.name.en }&nbsp;&nbsp;
        Price: { lineItem.totalPrice.centAmount/100}<br></br>
        { discounts ? <small>- discounts: {discounts}</small> : ''}

    </li>
  );
}

export default LineItemInfo
