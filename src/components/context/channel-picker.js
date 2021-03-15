import { useContext, useState, useEffect } from 'react';
import { callCT, requestBuilder } from '../../commercetools';
import AppContext from '../../appContext';

const VERBOSE = true;

function ChannelPicker() {

  const [context, setContext] = useContext(AppContext);

  let [channels, setChannels] = useState([]);

  const onChangeChannel = (event) => {
    const channelId = event.target.value;
    let channelName = "";
    if(channelId) {
      channelName = channels.find(c => c.id == channelId).name.en;
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
    if(channels.length) {
      return;
    }
 
    let uri = requestBuilder
                .channels
                .where('roles contains all ("ProductDistribution")').build() + '&limit=200&sort=name.en asc';

   
    VERBOSE && console.log('Get channels URI',uri);

    let res =  await callCT({
      uri: uri,
      method: 'GET'
    });
    if(res && res.body.results) {
      console.log('channels',res.body.results);
      setChannels(res.body.results);
    }
  };

  let channelOptions = "";
  if(channels.length) {
    channelOptions = channels.map(c => <option key={c.id} value={c.id}>{c.name.en}</option>);
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