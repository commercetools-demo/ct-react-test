import { callCT, requestBuilder } from '../../commercetools'
import { useEffect, useState } from 'react';
import ProductListEntry from './product-list-entry';

const ProductList = ({search}) => {

  let [products, setProducts] = useState([]);

  useEffect(() => {
    search && getProducts(search);
  });

  const getProducts = async (search) => {
    // Avoid repeat calls (?)
    if(products.length>0) {
      return;
    }

    let res =  await callCT({
      uri: requestBuilder.productProjectionsSearch
      .text(search,'en')
      .fuzzy(true)
      .perPage(20)
      .build(),
      method: 'GET'
    });
    if(res.body.results) {
      setProducts(res.body.results);
    } else {
      console.log('no results')
    }
  };

  if(products.length===0) {
    return null
  }


  return (
    <div>
      <ul>
        {products.map(product => <ProductListEntry key={product.id} product={product}/>)}
      </ul>
    </div>
  );
}

export default ProductList;
