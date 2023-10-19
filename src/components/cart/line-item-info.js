import config from '../../config';
import DiscountInfo from './discount-info';
import LineItemPriceInfo from './line-item-price-info';
import LineItemCustomFields from './line-item-custom-fields';
import { Container, Row, Col} from 'react-bootstrap';
import { addToCart } from '../../util/cart-util'

const VERBOSE=true;

const addonBoxStyle = {
  marginLeft: "0px",
  marginRight:"6px",
  width:"25px",
  height:"25px",
  verticalAlign:"middle",
  display:"inline-block",
  marginTop:"-3px",
  accentColor:"gray"
}

const LineItemInfo = ({lineItem,increment,decrement,addAddon, lineItems}) => {
  let addonHtml = (<></>);
  const callAddToCart = async (productId, variantId, custom) => {
    console.log("PRODUCT ID", productId)
    console.log("VARIANT ID", variantId)
  
    await addToCart(productId,variantId,custom);
    await addAddon();
  }
  const addon = lineItem?.variant?.attributes?.find((attr) => attr.name == "addonProducts");
  console.log("ADDON", addon)
  const addonSku = addon?.value.length && addon.value[0].find((item) => item.name === "sku")?.value;
  const addonProductId = addon?.value.length && addon.value[0].find((item) => item.name === "productRef")?.value?.id;
  const addonVariantId = addon?.value.length && addon.value[0].find((item) => item.name === "variantId")?.value;
  const isAddonInCart = lineItems.find((item) => item.variant.sku === addonSku);
  const isChecked = isAddonInCart ? {checked: true} : {checked: false};
  if(addon) {
    addonHtml = (
    <><Row>
        <LineItemCustomFields lineItem={lineItem} />
      </Row><Row>
          <Col style={{ "marginTop": "2px" }}>
            <input
              style={addonBoxStyle}
              {...isChecked}
              type="checkbox" onChange={(event) => {if(event.target.checked) {callAddToCart(addonProductId,addonVariantId,{})}}} />
            {addonSku}
          </Col>
        </Row></>
    )
  }

  return (
      <div>
      <Row>
        <Col>
            <button onClick={decrement}> - </button>&nbsp;
            { lineItem.quantity }&nbsp;
            <button onClick={increment}> + </button>
        </Col>
        <Col>
          {lineItem.variant.sku }
        </Col>
        <Col>
          {lineItem.name[config.locale] }
        </Col>
        <Col>
          <LineItemPriceInfo price={lineItem.price}/>
        </Col>
        <Col>
          {
            lineItem.discountedPricePerQuantity.length == 0 ?
            <span>N/A</span>
            : lineItem.discountedPricePerQuantity.length == 1 ?
              <LineItemPriceInfo price={lineItem.discountedPricePerQuantity[0].discountedPrice}/>
              : lineItem.discountedPricePerQuantity.map((item) => (
                <span>{item.quantity} @ <LineItemPriceInfo price={item.discountedPrice}/><br></br></span>
              ))
          }
        </Col>
        <Col>
          <LineItemPriceInfo price={lineItem.totalPrice}/>
        </Col>
        </Row>
    
     
      <><Row>
            <Col>
              <span className="small">
                {lineItem.discountedPricePerQuantity.length ?
                  <div>
                    <span className="heading">Discounted Price per Quantity</span>
                    <ul>
                      {lineItem.discountedPricePerQuantity.map((item) => (
                        <li>qty: {item.quantity} @ <LineItemPriceInfo price={item.discountedPrice} />
                          {item.discountedPrice.includedDiscounts.map((discount, index) => <DiscountInfo key={index} discount={discount} />)}
                        </li>))}
                    </ul>
                  </div>
                  :
                  <span>no discounts</span>}
              </span>
            </Col>
          </Row>
          {addonHtml}
          
        <hr></hr></>
      </div>
  )
}
//             

export default LineItemInfo
