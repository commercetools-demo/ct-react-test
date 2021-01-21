import { callCT, requestBuilder } from '../../commercetools'
import { useEffect, useState, useContext } from 'react';
import ProductListEntry from '../product-list-entry';
import AppContext from '../../appContext';

const ProductList = ({search}) => {

  const context = useContext(AppContext);

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
      .perPage(10)
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
      Country: {context.country}<br></br>
      <ul>
        {products.map(product => <ProductListEntry key={product.id} product={product}/>)}
      </ul>
    </div>
  );
}

export default ProductList;
