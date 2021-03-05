import './App.css';
import { useState } from 'react';
import SearchPage from './components/search/search-page';
import ProductDetailPage from './components/product-detail/product-detail-page';
import CartPage from './components/cart/cart-page';
import AccountPage from './components/user/account-page';
import ContextPage from './components/context/context-page';
import AppContext from './appContext.js';
import oktaConfig from './okta-config';
import {
  BrowserRouter,
  Switch,
  Route,
  NavLink
} from "react-router-dom";
import { Security, LoginCallback } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';

const CALLBACK_PATH = '/login/callback';
const oktaAuth = new OktaAuth(oktaConfig.oidc);
function App() {

  const [context, setContext] = useState({});
  
  return(
    <AppContext.Provider value={[context, setContext]}>
      <BrowserRouter>
        <Security oktaAuth={oktaAuth}>
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
                <li>
                  <NavLink to={"/account"} activeClassName="active">My Account</NavLink>
                </li>            
              </ul>
            </nav>
            <br></br>
          </div>       
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
            <Route path="/account">
              <AccountPage />
            </Route>
            <Route path={CALLBACK_PATH} component={LoginCallback} />
            <Route path="/">
              <SearchPage />
            </Route>
          </Switch>
        </Security>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
