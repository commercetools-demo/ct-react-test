import config from '../../config';
import { callCT, requestBuilder } from '../../commercetools'
import { useEffect, useState } from 'react';
import ProductListEntry from './product-list-entry';


const ProductList = ({search}) => {

  let [products, setProducts] = useState([]);
  
  let [searched, setSearched] = useState(false);

  useEffect(() => {
    search && getProducts(search);
  });

  const getProducts = async (search) => {
    // Avoid repeat calls (?)
    if(searched) {
      console.log('skipping');
      return;
    }
    setSearched(true);

    let res =  await callCT({
      uri: requestBuilder.productProjectionsSearch
      .text(search,config.locale)
      .fuzzy(true)
      .perPage(20)
      .build(),
      method: 'GET'
    });
    if(res && res.body.results) {
      setProducts(res.body.results);
    } else {
      console.log('no results')
    }
  };

  if(products.length===0) {
    return (
      <div>no results</div>
    )
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
