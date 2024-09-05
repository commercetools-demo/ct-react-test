import config from '../../config';
import { Link } from "react-router-dom";
import {formatPrice} from "../../util/priceUtil";


const ProductListEntry = ({product}) => {
  return (
    <li>
        {
            product.masterVariant.price ?
                product.masterVariant.price.discounted ?
                    <span>
                        <strike>{formatPrice(product.masterVariant.price)}</strike> {formatPrice(product.masterVariant.price.discounted)}
                        &nbsp;-&nbsp;
                    </span>
                    :
                    <span>
                        {formatPrice(product.masterVariant.price)}
                        &nbsp;-&nbsp;
                    </span>
                :
                <span></span>
        }
        <Link to={"/product-detail/"+product.id}>
            <strong>{product.name[config.locale]}</strong>
        </Link>
    </li>
  )
}

// TODO - ADD DESCRIPTION, proper localization

export default ProductListEntry
