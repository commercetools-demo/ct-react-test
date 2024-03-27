import { Container, Row, Col} from 'react-bootstrap';
import AppContext from '../../appContext';
import { apiRoot } from '../../commercetools';
import { useContext, useState, useEffect } from 'react';
import config from '../../config';

function Categories({parentId,indent}) {

  console.log('cat parent',parentId);
  const [categories, setCategories] = useState();

  useEffect(() => {
    fetchCategories(parentId);
  },parentId);

  async function fetchCategories(parentId) {

    if(parentId) {
      const res = await apiRoot.categories().get({
        queryArgs: {
          where: `parent(id="${parentId}")`
        }
      }).execute();
      if(res && res.body.results.length > 0) {
        const categories = res.body.results;
        await fetchProducts(categories);
        setCategories(categories);
        return;
      }
    }
    setCategories();
  }

  async function fetchProducts(categories) {
    const categoryIds = categories.map(c => '"' + c.id + '"').join(',');
    const res = await apiRoot.productProjections().get({
      queryArgs: {
        where: `categories(id in (${categoryIds}))`
      }
    }).execute();
    if(res && res.body.results?.length) {
      for(let cat of categories) {
        cat.products = [];
        for(let p of res.body.results) {
          if(p.categories.find(c => c.id == cat.id)) {
            cat.products.push(p);
          }
        }
      }
    }
  }


  return (
    <Container>
      { categories?.length && categories.map((cat,index) => 
        <Container>
          <Row>
            {cat.name[config.locale]}
          </Row>          
          {cat.products.length ? cat.products.map((product,index) =>
            <Container className="indent" id={index}>
              <Row>
                 <span className="indent"> &rarr; { product.name[config.locale]} </span>
              </Row>
            </Container> 
          ) : <></>}
            <Categories parentId={cat.id} indent={indent+4}/>
        </Container>
      )} 
    </Container>
  );
}

export default Categories;