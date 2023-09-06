// Display a product that has a warranty
import config from '../../config';
import { useState, useContext } from 'react';
import SizePicker from './size-picker';
import AppContext from '../../appContext';
import { Container, Row, Col} from 'react-bootstrap';
import PriceInfo from './price-info';
import Warranty from './warranty';
import { addToCart, updateCart } from '../../util/cart-util'
import { withRouter } from "react-router";

const ProductWithWarranty = (props) => {
  const [price, setPrice] = useState(null);
  const [variant, setVariant] = useState(null);
  const [warrantyPrice, setWarrantyPrice] = useState(null);

  const [context, setContext] = useContext(AppContext);

  const product = props.product;
  const history = props.history; 

  if(!product) {
    return null
  }

  const warrantyAttr = product.masterVariant.attributes.find(a => a.name=='warranty');
  const warranty = warrantyAttr?.value?.obj;

  const selectVariant = (variant) => {
    console.log("SELECT VARIANT",variant);
    setVariant(variant);
    setPrice(variant.price);
  }

  const updateParent = (price) => {
    console.log('SET WARRANTY PRICE',price);
    setWarrantyPrice(price.amount);
  }

  const callAddToCart = async () => {
    const productId = product.id;
    let cart = await addToCart(productId,variant.id);

    // Now, add child line item.  Assume last-added line item is parent
    const parent = cart.lineItems[cart.lineItems.length-1].id;
    const action = {
      action: 'addLineItem',
      sku: warranty.masterData.current.masterVariant.sku,
      externalPrice: {
        centAmount: warrantyPrice * 100,
        currencyCode: 'CAD'
      },
      custom: {
        type: {
          key: 'custom-line-item'
        },
        fields: {
          parent
        }
      }
    }
    const result = await updateCart(action);
    if(result) {
      history.push('/cart');
    } else {
      //window.location.reload();
    }
  }


 
  return (
    <Container>
      <Row>
        <Col><h2>{product.name[config.locale]}</h2></Col>
      </Row>   
      <Row>
        <Col>
          { product.masterVariant.images.map(image => <img key={image} src={image.url} height={image.dimensions.h} width={image.dimensions.w} alt={image.label}/>) }<br/>
        </Col>
        <Col>
          <Row>
            <h3>Size:</h3>
            <SizePicker variant={product.masterVariant} selectVariant={selectVariant}/>
            { product.variants.map(variant => <SizePicker key={variant.id} variant={variant} selectVariant={selectVariant}/>) }
          </Row>
          <Row>
            <h6>Price: <PriceInfo price={price} />
            </h6>
          </Row>
          <Row>
            { warranty && (
                <div>
                  <input type="checkbox"/>  Include Warranty
                  <Warranty warranty={warranty} parentPrice={price} updateParent={updateParent} />
                </div>
              )
            }
          </Row>
          <Row>
          <button type="button" onClick={callAddToCart}>Add to Cart</button>
          </Row>
        </Col>
      </Row>
      <Row>
        <h3>Description</h3>
        <p>{product.description ? product.description[config.locale] : ""}</p>
      </Row>
    </Container>
  )
}

export default withRouter(ProductWithWarranty);
