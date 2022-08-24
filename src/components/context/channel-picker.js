import config from '../../config';
import { useContext, useState, useEffect } from 'react';
import { apiRoot } from '../../commercetools';
import AppContext from '../../appContext';

const VERBOSE = true;

function ChannelPicker() {

  const [context, setContext] = useContext(AppContext);

  let [channels, setChannels] = useState([]);
  let [fetched, setFetched] = useState(false);

  let locale = config.locale;

  const onChangeChannel = (event) => {
    const channelId = event.target.value;
    let channelName = "";
    if(channelId) {
      channelName = channels.find(c => c.id == channelId).name[locale];
      setContext({...context,channelId: channelId, channelName: channelName});
      sessionStorage.setItem('channelId',channelId);
      sessionStorage.setItem('channelName',channelName);
    } else {
      setContext({...context,channelId: null, channelName: ''});
      sessionStorage.removeItem('channelId');
      sessionStorage.removeItem('channelName');
    }
  }
  useEffect(() => {
    fetchChannels();
  });

  async function fetchChannels()  {
    // Avoid repeat calls (?)
    if(fetched) {
      return;
    }
    setFetched(true);
 

    let res =  await apiRoot
      .channels()
      .get({ queryArgs: {
        where: 'roles contains all ("ProductDistribution")',
        limit: 200,
        sort: `name.${locale} asc`
      }})
      .execute();
      
    if(res && res.body.results) {
      console.log('channels',res.body.results);
      setChannels(res.body.results);
    }
  };

  let channelOptions = "";
  if(channels.length) {
    channelOptions = channels.map(c => <option key={c.id} value={c.id}>{c.name[config.locale]}</option>);
  }

  let selectedChannel=context.channelId ? context.channelId : '';

  return (
    <div>
      Channel:&nbsp;&nbsp;  
      <select value={selectedChannel} onChange={onChangeChannel}>
        <option value="">(none selected)</option>
        {channelOptions}
      </select>
    </div>
  );
      
}

export default ChannelPicker;