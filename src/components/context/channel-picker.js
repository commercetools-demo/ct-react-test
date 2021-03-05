import { useState, useEffect } from 'react';
import { callCT, requestBuilder } from '../../commercetools';

const VERBOSE = true;

function ChannelPicker() {
  
  const onChangeChannel = (event) => {
    const channelId = event.target.value;
    let channelName = "";
    if(channelId) {
      channelName = channels.find(c => c.id == channelId).name.en;
      sessionStorage.setItem('channelId',channelId);
      sessionStorage.setItem('channelName',channelName);
    } else {
      sessionStorage.removeItem('channelId');
      sessionStorage.removeItem('channelName');
    }
  }


  let [channels, setChannels] = useState([]);

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

  let selectedChannel=sessionStorage.getItem('channelId') ? sessionStorage.getItem('channelId') : '';

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