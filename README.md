# ct-react-test

A simple React app for testing various API functions from the browser.
This example calls the product projections Search API to fetch a list of products.
Optionally, you can use commercetools' price selection logic to fetch the correct price 
for a product using a combination of currency, country, channel, and customer group parameters

# Calling commercetools APIs:

The motivation for building this application is to provide some working examples of working with commercetools APIs from a simple, bare-bones, React front-end.  

## src/commercetools-ts.js
The code to authenticate with commercetools and call the APIs is encapsulated inside ```src/commercetools-ts.js```.  This is a simple "wrapper" for the commercetools TypeScript SDK, exposing apiRoot (with project key)

# Pages

## SearchPage 
```src/components/search```:
Displays an input form that lets the user search for products

## ProductDetailPage:
```src/components/product-detail```:
Display a single product & variants

## ContextPage:
```src/components/context```:
This displays a set of input elements to allow the user to choose the 'context' for product/price lookup:  Country, Currency, Channel, and Customer Group.  

## CartPage:
```src/components/cart```:
Display the shopping cart with detailed discount information.

## DiscountDetailPage:
```src/components/discount-detail```:
Searches for product that are a part of the given discount id.

# Setup:

1. Head on over to https://mc.us-central1.gcp.commercetools.com/unity-store/settings/developer/api-clients
and generate your API client (use an admin scope for ease of development for now)
2. Copy the `.env.sample` file as `.env` and include the values from your generated API client
3.  Install Dependencies: `yarn`

---
# To run:

`yarn start`

Runs the app in  development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

