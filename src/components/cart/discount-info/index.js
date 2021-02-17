import { useState, useEffect } from 'react';
import { callCT, requestBuilder } from '../../../commercetools';

const VERBOSE=true;

const DiscountInfo = ({discount}) => {

  console.log('discount',discount);

  return (
    <li>
        Name: { discount.discount.obj.name.en } &nbsp;&nbsp;
        Discounted Amount:  { discount.discountedAmount.centAmount/100 }
    </li>
  );
}

export default DiscountInfo
