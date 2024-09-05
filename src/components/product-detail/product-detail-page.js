import config from '../../config';
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import VariantInfo from './variant-info';
import ContextDisplay from '../context/context-display';
import AppContext from '../../appContext';
import { apiRoot } from '../../commercetools';
import { setQueryArgs } from '../../util/searchUtil';

const VERBOSE=true;

const ProductDetailPage = () => {
  let { id } = useParams();

  const [context, setContext] = useContext(AppContext);
 
  let [product, setProduct] = useState(null);  
  let [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct(id);
  });

  const fetchProduct = async (id) => {
    // Avoid repeat calls (?)
    if(product || !id || id == 'undefined') {
      return;
    }

    if(id != context.productId ) {
      setContext({...context, productId: id});
    }
    
    const queryArgs = setQueryArgs();

    /* Last, but not least, add reference expansions to include channel and customer group data */
    queryArgs.expand = [
      'masterVariant.prices[*].channel',
      'masterVariant.prices[*].customerGroup',
      'masterVariant.prices[*].discounted.discount',
      'masterVariant.price.discounted.discount',
      'variants[*].prices[*].channel',
      'variants[*].prices[*].customerGroup',
      'variants[*].prices[*].discounted.discount',
      'variants[*].price.discounted.discount',
    ];


    let res =  await apiRoot
      .productProjections()
      .withId({ ID: id })
      .get({ queryArgs: queryArgs })
      .execute();

    console.log(res);
    if(res && res.body) {
      setProduct(res.body);
    }
  };

  if(!product) {
    return (<div>No product selected</div>)
  }

  return (
    <div>
      <ContextDisplay />
      <h1>{product.name[config.locale]}</h1>
      { error && (
        <h5><font color="red">{error}</font></h5>
      )}
      <h3>Variants:</h3>
      <ul>
        <VariantInfo priceMode={product.priceMode} variant={product.masterVariant} />
        { product.variants.map(variant => <VariantInfo key={variant.id} variant={variant}/>) }
      </ul>
      <h3>Description</h3>
      <p>{product.description ? product.description[config.locale] : ""}</p>
    </div>
  )
}

export default ProductDetailPage;
