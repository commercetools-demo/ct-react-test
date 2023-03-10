import {useContext, useEffect, useState} from 'react';
import {setQueryArgs} from "../../util/searchUtil";
import {apiRoot} from "../../commercetools";
import ProductListEntry from "../search/product-list-entry";
import {useParams} from "react-router-dom";
import AppContext from "../../appContext";
import ContextDisplay from "../context/context-display";

function DiscountDetailPage() {
    let { id } = useParams();

    const [context, setContext] = useContext(AppContext);

    let [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts(id).then(r => {});
    }, [])

    const getProducts = async (discountId) => {
        if(id !== context.discountId ) {
            setContext({...context, discountId: id});
        }

        const queryArgs  = {
            ...setQueryArgs(),
            "filter": `variants.prices.discounted.discount.id:"${discountId}"`,
            limit: 50,
            expand: [
                // 'masterVariant.attributes[*].value'
            ]
        };

        const res = await apiRoot.productProjections()
            .search()
            .get({queryArgs: queryArgs})
            .execute();

        if (res && res.body.results) {
            setProducts(res.body.results);
        } else {
            console.log('no results');
        }
    };

    if(products && products.length===0) {
        return (
            <div>no results</div>
        )
    }


    return (
        <div>
            <ContextDisplay />
            <h3>Product List</h3>
            <ul>
                {products.map(product => <ProductListEntry key={product.id} product={product}/>)}
            </ul>
        </div>
    );
}

export default DiscountDetailPage;
