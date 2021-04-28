import config from '../../config';
import {
  Link
} from "react-router-dom";


const ProductListEntry = ({product}) => {
  return (
    <li>
      <Link to={"/product-detail/"+product.id}>
     {product.name[config.locale]}: 
     </Link>
    </li>
  )
}

// TODO - ADD DESCRIPTION, proper localization

export default ProductListEntry
