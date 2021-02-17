import './App.css';
import { useState } from 'react';
import SearchPage from './components/search';
import ProductDetailPage from './components/product-detail';
import CartPage from './components/cart';
import ContextPage from './components/context';
import AppContext from './appContext.js';
import {
  BrowserRouter,
  Switch,
  Route,
  NavLink
} from "react-router-dom";


function App() {

  const [context, setContext] = useState({});
  
  return(
    <AppContext.Provider value={[context, setContext]}>
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
                  <NavLink to={"/product-detail/"+context.productId} activeClassName="active">Product Detail</NavLink>
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
      </AppContext.Provider>
  );
}

export default App;
