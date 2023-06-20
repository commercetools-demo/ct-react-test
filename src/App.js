import { OktaAuth } from '@okta/okta-auth-js';
import { LoginCallback, Security } from '@okta/okta-react';
import { useState } from 'react';
import {
  BrowserRouter,
  NavLink,
  Route,
  Switch
} from "react-router-dom";
import './App.css';
import AppContext from './appContext.js';
import CartPage from './components/cart/cart-page';
import ContextPage from './components/context/context-page';
import DiscountDetailPage from "./components/discount/discount-detail-page";
import OrderPage from './components/order/order-page';
import PaymentPage from './components/payment/payment-page';
import ProductDetailPage from './components/product-detail/product-detail-page';
import SearchPage from './components/search/search-page';
import AccountPage from './components/user/account-page';
import oktaConfig from './okta-config';
import config from './config';
import Helmet from 'react-helmet';

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
    customerGroupName: sessionStorage.getItem('customerGroupName'),
    accessToken: sessionStorage.getItem('accessToken')
  });

  const handleScriptInject = ({scriptTags}) => {
    if(scriptTags) {
      const scriptTag = scriptTags[0];
      scriptTag.onload = () => {
        console.log('lib added', window.Z)
      }
    }
  }
  
  return(
    <AppContext.Provider value={[context, setContext]}>
      <Helmet 
        script = {[{src: "https://static.zuora.com/Resources/libs/hosted/1.3.1/zuora-min.js"}]}
        onChangeClientState={(newState, addedTags) => handleScriptInject(addedTags)}
      />
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
                  {config.showPaymentPage &&    
                    <li>
                      <NavLink to={"/payment"} activeClassName="active">Payment</NavLink>
                    </li>          
                  }    
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
              <Route path="/payment">
                <PaymentPage />
              </Route>
              <Route path={CALLBACK_PATH} component={LoginCallback} />
              <Route path="/">
                <SearchPage />
              </Route>
            </Switch>
          </div>
        </Security>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
