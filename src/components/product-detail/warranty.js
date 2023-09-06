// Display a product that has a warranty
import config from '../../config';
import { useState, useContext, useEffect } from 'react';
import { Container, Row, Col} from 'react-bootstrap';
import { apiRoot } from '../../commercetools';

const Warranty = ({warranty, parentPrice, updateParent }) => {

  console.log('WARRANTY',warranty,'PARENT',parentPrice);
  if(!warranty || !parentPrice) {
    return null;
  }

  const [warrantyPrices, setWarrantyPrices] = useState(null);
  const [price, setPrice] = useState(null);
  const productInfo = warranty.masterData.current;

  useEffect(() => {
    fetchWarrantyPrices();    
  });

  useEffect(() => {
    if(warrantyPrices) {
      for(let priceElement of warrantyPrices) {
        if(priceElement.parentMin.amount*100 < parentPrice.value.centAmount) {
          setPrice(priceElement.price);
          updateParent(priceElement.price);
          return;
        }
      }
    }
  });

  const reverseParentMin = (a,b) => {
    console.log("a",a,"b",b);
    return b.parentMin.amount - a.parentMin.amount;
  }

  const fetchWarrantyPrices = async () => {
    // Avoid repeat calls
    if(warrantyPrices) {
      return;
    }

    const container = 'warranty-price';
    const key = 'prices'
    let res =  await apiRoot
      .customObjects().withContainerAndKey({ container, key}).get().execute();

    if(res && res.body) {
      let priceArray = res?.body?.value?.prices;
      if(!priceArray) {
        console.warn('NO PRICE ARRAY');
        setPrice({amount: 0});
        return;
      }
      priceArray.map(a => a.parentMin.amount = parseFloat(a.parentMin.amount.replace(',','')));
      priceArray.map(a => a.price.amount = parseFloat(a.price.amount.replace(',','')));
      priceArray.sort(reverseParentMin);
      setWarrantyPrices(priceArray);
    }
  }


  return (
    <Container>
      <Row>
        <Col><h6>{productInfo.name[config.locale]}</h6></Col>
      </Row>
      { price && (         
        <Row>
          Price: CAD ${ price.amount }
        </Row>
      ) }
    </Container>
  )
}

export default Warranty;
