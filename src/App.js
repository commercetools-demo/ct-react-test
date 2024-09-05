import './App.css';
import { useState } from 'react';
import HomePage from './components/home/home-page';
import ProductDetailPage from './components/product-detail/product-detail-page';
import CartPage from './components/cart/cart-page';
import OrderPage from './components/order/order-page';
import AccountPage from './components/user/account-page';
import ContextPage from './components/context/context-page';
import DiscountDetailPage from "./components/discount/discount-detail-page";
import AppContext from './appContext.js';
import oktaConfig from './okta-config';
import {
  BrowserRouter,
  Routes,
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
    customerGroupName: sessionStorage.getItem('customerGroupName'),
  });
  
  return(
    <AppContext.Provider value={[context, setContext]}>
      <BrowserRouter>
          <div id="root">
            <div>
              <nav>
                <ul>
                  <li>
                    <NavLink to="/" >Home</NavLink>
                  </li>
                  <li>
                    <NavLink to="/context" >Context</NavLink>
                  </li>             
                  <li>
                    <NavLink to={`/product-detail/${context.productId}`}>Product Detail</NavLink>
                  </li>
                  <li>
                    <NavLink to={"/discount-detail/"+context.discountId} >Discount Detail</NavLink>
                  </li>
                  <li>
                    <NavLink to={"/cart"} >Cart</NavLink>
                  </li>
                  <li>
                    <NavLink to={"/account"} >My Account</NavLink>
                  </li>
                  <li>
                    <NavLink to={"/order"} >Order</NavLink>
                  </li>                
                </ul>
              </nav>
              <br></br>
            </div>       
            <Routes>
              <Route path="/context" element={<ContextPage />}/>
              <Route path="/product-detail/:id" element={<ProductDetailPage />}/>
              <Route path="/discount-detail/:id" element={<DiscountDetailPage />}/>
              <Route path="/cart" element={<CartPage />}/>
              <Route path="/account" element={<AccountPage />}/>                
              <Route path="/order" element={<OrderPage />}/>                
              <Route path="/" element={<HomePage />}/>
            </Routes>
          </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
