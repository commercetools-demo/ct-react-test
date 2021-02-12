import './App.css';
import SearchPage from './components/search-page';
import ProductDetailPage from './components/product-detail-page';
import CartPage from './components/cart-page';
import ContextPage from './components/context-page';
import {
  BrowserRouter,
  Switch,
  Route,
  NavLink
} from "react-router-dom";


function App() {

  const productId=sessionStorage.getItem('productId');
  
  return(
    <BrowserRouter>
        <div>
          <nav>
            <ul>
              <li>
                <NavLink exact to="/" activeClassName="active">Home</NavLink>
              </li>
              <li>
                <NavLink to="/context" activeClassName="active">Context</NavLink>
              </li>             
              <li>
                <NavLink to={"/product-detail/"+productId} activeClassName="active">Product Detail</NavLink>
              </li>
              <li>
                <NavLink to={"/cart"} activeClassName="active">Cart</NavLink>
              </li>            
            </ul>
          </nav>
          <br></br>
          <Switch>
            <Route path="/context">
              <ContextPage />
            </Route>
            <Route path="/product-detail/:id">
              <ProductDetailPage />
            </Route>
            <Route path="/cart">
              <CartPage />
            </Route>
            <Route path="/">
              <SearchPage />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
  );
}

export default App;
