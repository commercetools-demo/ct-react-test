import config from '../../config';
import { apiRoot } from '../../commercetools-ts'
import { useEffect, useState } from 'react';
import ProductListEntry from './product-list-entry';

const ProductList = ({search}) => {

  let [products, setProducts] = useState([]);
  
  let [searched, setSearched] = useState(false);

  useEffect(() => {
    search && getProducts(search);
  });

  const getProducts = async (searchStr) => {
    // Avoid repeat calls (?)
    if(searched) {
      console.log('skipping');
      return;
    }
    setSearched(true);

    const res =  await apiRoot.productProjections()
      .search()
      .get({ queryArgs: {
        [`text.${config.locale}`] : searchStr,
        fuzzy: true,
        limit: 20
      }})
      .execute();

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
