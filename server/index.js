require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const { uuid } = require("uuidv4");
const bodyParser = require('body-parser');

const { Client, Config, CheckoutAPI } = require("@adyen/api-library");

const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with the origin(s) you want to allow
  };
  
const app = express();
const port = 3001;

app.use(cors(corsOptions));
app.use(bodyParser.json());

  // Adyen Node.js API library boilerplate (configuration, etc.)
  const config = new Config();
  config.apiKey = process.env.ADYEN_API_KEY;
  const client = new Client({ config });
  client.setEnvironment("TEST");  // change to LIVE for production
  const checkout = new CheckoutAPI(client);


const createPaymentSession = async (req, res) => {
    try {
        // unique ref for the transaction
        const orderRef = uuid();
        const organizationId = "KATOrgId";

        const reqBody = req.body;
        console.log(reqBody);

        const currency = reqBody.currency;
        const countryCode = reqBody.countryCode;
        const price =  reqBody.price; 
        const lineItems = reqBody.lineItems;

        const paymentReference = `SAMPLE_PAYMENT_${organizationId}`;
        // Allows for gitpod support
        const localhost = req.get('host');
        // const isHttps = req.connection.encrypted;
        const protocol = req.socket.encrypted? 'https' : 'http';
        // Ideally the data passed here should be computed based on business logic
        const response = await checkout.PaymentsApi.sessions({
          amount: { currency: currency, value: price }, // value is 100€ in minor units
          countryCode: countryCode,
          merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT, // required
          reference: orderRef, // required: your Payment Reference
          returnUrl: `${protocol}://${localhost}/checkout?orderRef=${orderRef}`, // set redirect URL required for some payment methods (ie iDEAL)
          lineItems: lineItems
        });
    
       return res.status(200).json(response);
      } catch (err) {
        console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
        return res.status(err.statusCode || 500).json(err.message);
      }

}

app.post('/api/sessions', async (req, res) => {
    return createPaymentSession(req, res);
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});