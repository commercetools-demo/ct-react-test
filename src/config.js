const {
  REACT_APP_ZUORA_PAYMENT_PAGE_ID,
  REACT_APP_ZUORA_PAYMENT_PAGE_NAME,
  REACT_APP_ZUORA_PAYMENT_PAGE_URL,
  REACT_APP_ZUORA_ACCOUNT_ID,
  REACT_APP_ZUORA_PAYMENT_BASE_URL
} = process.env;

module.exports = {
  locale: 'en-US',
  showPaymentPage: false,
  zuora: {
    name: REACT_APP_ZUORA_PAYMENT_PAGE_NAME,
    pageId: REACT_APP_ZUORA_PAYMENT_PAGE_ID,
    payment_page_url: REACT_APP_ZUORA_PAYMENT_PAGE_URL,
    accountId:REACT_APP_ZUORA_ACCOUNT_ID,
    baseUrl: REACT_APP_ZUORA_PAYMENT_BASE_URL
  }
}