import config from '../../config';
import { apiRoot } from '../../commercetools'
import { useEffect, useState } from 'react';
import ProductListEntry from './product-list-entry';
import { setQueryArgs } from '../../util/searchUtil';

const ProductList = (props) => {

  let [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts(props.search);
  }, [props.search, props.scoped]);

  const getProducts = async (searchStr) => {
    const queryArgs = {
      ...setQueryArgs(),
      [`text.${config.locale}`] : searchStr,
      fuzzy: true,
      limit: 50
    };
  
    if(props.scoped) {
      queryArgs['filter.query'] = 'variants.scopedPrice.value.centAmount:range (0 to 99999)'
    }

    const res =  await apiRoot.productProjections()
      .search()
      .get({ queryArgs: queryArgs})
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
