import AttributeInfo from '../attribute-info';
import PriceInfo from '../price-info';
import {
  Link
} from "react-router-dom";

const VERBOSE=false;

const VariantInfo = ({variant}) => {
  VERBOSE && console.log('variant',variant);
  return (
    <li>
        SKU: { variant.sku } <br></br>
        Variant Key:  { variant.key } <br></br>
        { variant.price
        ? <span>Price: (using price selection): {variant.price.value.centAmount/100}</span>
        :
          <div>
            Prices:<br></br>
            <small>All prices displayed.  To use Price Selection logic, go to <Link to="/context">Context</Link><br></br>
            and select a currency (required), and one or more additional options.</small>
            <table border="1" cellSpacing="0">
              <thead>
                <tr>
                  <td>Currency</td>
                  <td>Country</td>                
                  <td>Channel</td>
                  <td>Customer Group</td>
                  <td>Price</td>
                </tr>
              </thead>
              <tbody>
              { variant.price
                ? <PriceInfo price={variant.price} />
                : variant.prices.map((price,index) => <PriceInfo key={index} price={price} />)
              }
              </tbody> 
            </table>
          </div>
        }
        <p></p>
        <h4>Attributes:</h4> { variant.attributes.map(attr => <AttributeInfo key={attr.name} attr={attr} />) } <br></br>
        <p></p>
    </li>
  );
}

export default VariantInfo
