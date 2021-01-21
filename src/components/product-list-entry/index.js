import {
  Link
} from "react-router-dom";


const ProductListEntry = ({product}) => {
  return (
    <li>
      <Link to={"/product-detail/"+product.id}>
     {product.name.en}
     </Link>
    </li>
  )
}

export default ProductListEntry
