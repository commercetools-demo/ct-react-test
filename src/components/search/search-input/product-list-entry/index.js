import {
  Link
} from "react-router-dom";


const ProductListEntry = ({product}) => {
  return (
    <li>
      <Link to={"/product-detail/"+product.id}>
     {product.name.en}: {product.description.en}
     </Link>
    </li>
  )
}

export default ProductListEntry
