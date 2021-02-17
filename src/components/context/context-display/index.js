function ContextDisplay() {

  return (
    <div>
      <h4>Current Context:</h4>
      Currency:  {sessionStorage.getItem('currency')}
      &nbsp;|&nbsp;
      Country: {sessionStorage.getItem('country')}
      &nbsp;|&nbsp;
      Channel:  {sessionStorage.getItem('channelName')}
      &nbsp;|&nbsp;
      Store:  {sessionStorage.getItem('storeName')}
      &nbsp;|&nbsp;
      Customer Group: {sessionStorage.getItem('customerGroupName')}
      <hr></hr>
    </div>
  );
      
}

export default ContextDisplay;