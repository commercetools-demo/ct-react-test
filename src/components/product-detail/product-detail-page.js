import config from '../../config';
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import VariantInfo from './variant-info';
import ContextDisplay from '../context/context-display';
import AppContext from '../../appContext';
import { apiRoot } from '../../commercetools';

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
    if(product || !id) {
      return;
    }

    if(id != context.productId ) {
      setContext({...context, productId: id});
    }

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

    const queryArgs = {};

    console.log('currency',currency);
    if(currency) {
      queryArgs.priceCurrency=currency;
      if(country) {
        queryArgs.priceCountry=country;
      }
      if(channelId) {
        queryArgs.priceChannel=channelId;
      }
      if(customerGroupId) {
        queryArgs.priceCustomerGroup=customerGroupId;
      }
    }
    if(storeKey) {
      queryArgs.storeProjection=storeKey;
    }

    /* Last, but not least, add a couple of reference expansions to include channel and customer group data */
    queryArgs.expand = [
      'masterVariant.prices[*].channel',
      'masterVariant.prices[*].customerGroup',
      'variants[*].prices[*].channel',
      'variants[*].prices[*].customerGroup'
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
    return null
  }

  return (
    <div>
      <ContextDisplay />
      <h1>{product.name[config.locale]}</h1>
      
      <h3>Variants:</h3>
      <ul>
        <VariantInfo variant={product.masterVariant} />
        { product.variants.map(variant => <VariantInfo key={variant.id} variant={variant}/>) }
      </ul>
    </div>
  )
}

// TODO - Add description, proper localization
// {product.description.en}<p>&nbsp;</p>

export default ProductDetailPage;
