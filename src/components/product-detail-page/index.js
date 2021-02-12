import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { callCT, requestBuilder } from '../../commercetools';
import VariantInfo from '../variant-info';
import ContextDisplay from '../context-display';

const VERBOSE=true;

const ProductDetailPage = () => {
  let { id } = useParams();

  let [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct(id);
  });

  const fetchProduct = async (id) => {
    // Avoid repeat calls (?)
    if(product) {
      return;
    }

    if(id != sessionStorage.getItem('productId') ) {
      sessionStorage.setItem('productId',id);
    }

    let params = ['']      
    let uri = requestBuilder.productProjections.byId(id).build();

    /* Depending on the context settings, we may tack on additional price selection parameters.
    The primary price selection parameter is always currency
    (see https://docs.commercetools.com/api/projects/products#price-selection)
    If currency is found, we add additional parameters.
    */
    const currency = sessionStorage.getItem('currency');
    const country = sessionStorage.getItem('country');
    const channelId = sessionStorage.getItem('channelId');
    const customerGroupId = sessionStorage.getItem('customerGroupId');
    const storeKey = sessionStorage.getItem('storeKey');

    console.log('currency',currency);
    if(currency) {
      params.push(`priceCurrency=${currency}`);
      if(country) {
        params.push(`priceCountry=${country}`);
      }
      if(channelId) {
        params.push(`priceChannel=${channelId}`);
      }
      if(customerGroupId) {
        params.push(`priceCustomerGroup=${customerGroupId}`);
      }
    }
    if(storeKey) {
      params.push(`storeProjection=${storeKey}`);
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
      {product.description.en}<p>&nbsp;</p>
      <h3>Variants:</h3>
      <ul>
        <VariantInfo variant={product.masterVariant} />
        { product.variants.map(variant => <VariantInfo key={variant.id} variant={variant}/>) }
      </ul>
    </div>
  )
}

export default ProductDetailPage;
