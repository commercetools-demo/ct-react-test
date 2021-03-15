import { useContext} from 'react';
import AppContext from '../../appContext';

function ContextDisplay() {

  const [context] = useContext(AppContext);

  return (
    <div>
      <h4>Current Context:</h4>
      Currency:  {context.currency}
      &nbsp;|&nbsp;
      Country: {context.country}
      &nbsp;|&nbsp;
      Channel:  {context.channelName}
      &nbsp;|&nbsp;
      Store:  {context.storeName}
      &nbsp;|&nbsp;
      Customer Group: {context.customerGroupName}
      <hr></hr>
    </div>
  );
      
}

export default ContextDisplay;