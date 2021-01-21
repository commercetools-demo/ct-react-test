import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { callCT, requestBuilder } from '../../commercetools';
import VariantInfo from '../variant-info';
import AppContext from '../../appContext';
import ContextDisplay from '../context-display';

const VERBOSE=true;

const ProductDetailPage = () => {
  let { id } = useParams();

  const [context, setContext] = useContext(AppContext);
  let [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct(id);
  });

  const fetchProduct = async (id) => {
    // Avoid repeat calls (?)
    if(product) {
      return;
    }

    if(id != context.productId ) {
      setContext({...context, productId: id});
    }

    let params = ['']      
    let uri = requestBuilder.productProjections.byId(id).build();

    /* Depending on the context settings, we may tack on additional price selection parameters.
    The primary price selection parameter is always currency
    (see https://docs.commercetools.com/api/projects/products#price-selection)
    If currency is found, we add additional parameters.
    */

    if(context.currency) {
      params.push(`priceCurrency=${context.currency}`);
      if(context.country) {
        params.push(`priceCountry=${context.country}`);
      }
      if(context.channel) {
        params.push(`priceChannel=${context.channel}`);
      }
      if(context.customerGroup) {
        params.push(`priceCustomerGroup=${context.customerGroup}`);
      }
    }

    /* Last, but not least, add a couple of reference expansions to include channel and customer group data */
    params = params.concat([
      'expand=masterVariant.prices[*].channel',
      'expand=masterVariant.prices[*].customerGroup',
      'expand=variants[*].prices[*].channel',
      'expand=variants[*].prices[*].customerGroup']);

    if(params) {
      uri = uri + '?' + params.join('&');
    }

    VERBOSE && console.log('Get product projections URI',uri);

    let res =  await callCT({
      uri: uri,
      method: 'GET'
    });
    if(res && res.body) {
      setProduct(res.body);
    }
  };

  if(!product) {
    return null
  }

  return (
    <div>
      <ContextDisplay />
      <h1>{product.name.en}</h1>
      Variants:
      <ul>
        <VariantInfo variant={product.masterVariant} />
        { product.variants.map(variant => <VariantInfo key={variant.id} variant={variant}/>) }
      </ul>
    </div>
  )
}

export default ProductDetailPage;
