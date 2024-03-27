import './App.css';
import { useState } from 'react';
import HomePage from './components/home/home-page';
import ProductDetailPage from './components/product-detail/product-detail-page';
import CartPage from './components/cart/cart-page';
import OrderPage from './components/order/order-page';
import AccountPage from './components/user/account-page';
import ContextPage from './components/context/context-page';
import DiscountDetailPage from "./components/discount/discount-detail-page";
import StorePage from "./components/store/store-page";
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

  // Initialize context from session state.
  const [context, setContext] = useState({
    currency: sessionStorage.getItem('currency'),
    country: sessionStorage.getItem('country'),
    channelId: sessionStorage.getItem('channelId'),
    channelName: sessionStorage.getItem('channelName'),
    storeKey: sessionStorage.getItem('storeKey'),
    storeName: sessionStorage.getItem('storeName'),
    customerGroupId: sessionStorage.getItem('customerGroupId'),
    customerGroupName: sessionStorage.getItem('customerGroupName')
  });
  
  return(
    <AppContext.Provider value={[context, setContext]}>
      <BrowserRouter>
        <Security oktaAuth={oktaAuth}>
          <div id="root">
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
                    <NavLink to={"/discount-detail/"+context.discountId} activeClassName="active">Discount Detail</NavLink>
                  </li>
                  <li>
                    <NavLink to={"/cart"} activeClassName="active">Cart</NavLink>
                  </li>
                  <li>
                    <NavLink to={"/account"} activeClassName="active">My Account</NavLink>
                  </li>
                  <li>
                    <NavLink to={"/order"} activeClassName="active">Order</NavLink>
                  </li>
                  <li>
                    <NavLink to={"/store"} activeClassName="active">Store Picker</NavLink>
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
              <Route path="/discount-detail/:id">
                <DiscountDetailPage />
              </Route>
              <Route path="/cart">
                <CartPage />
              </Route>
              <Route path="/account">
                <AccountPage />
              </Route>
              <Route path="/order">
                <OrderPage />
              </Route>
              <Route path="/store">
                <StorePage />
              </Route>
              <Route path={CALLBACK_PATH} component={LoginCallback} />
              <Route path="/">
                <HomePage />
              </Route>
            </Switch>
          </div>
        </Security>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
