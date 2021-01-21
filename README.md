# ct-product-price

A simple React app that demonstrates calling the commercetools APIs from a browser.
This example calls the product projections Search API to fetch a list of products.
Optionally, you can use commercetools' price selection logic to fetch the correct price 
for a product using a combination of currency, country, channel, and customer group parameters

# Calling commercetools APIs:

The motivation for building this application is to provide some working examples of working with commercetools APIs from a simple, bare-bones, React front-end.  

## src/commercetools.js
The code to authenticate with commercetools and call the APIs is encapsulated inside ```src/commercetools.js```.  This is a simple "wrapper" for the commercetools JS SDK components, exposing two methods:  **requestBuilder** and **callCT**.  

If you're not using React, you should still be able to use this in other applications, see the comments in the file for more information.

# Pages

## SearchPage 
```src/components/search-page```:
Displays an input form that lets the user search for products

## ProductDetailPage:
```src/components/product-detail-page```:
Display a single product & variants

## ContextPage:
```src/components/context-page```:

This displays a set of input elements to allow the user to choose the 'context' for product/price lookup:  Country, Currency, Channel, and Customer Group.  

# Setup:

Copy .env.sample to .env in the root folder and set the appropriate values for your project/developer API client.

Install Dependencies:

```yarn```

---
# To run:

`yarn start`

Runs the app in  development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

