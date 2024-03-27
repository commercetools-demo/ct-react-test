import config from '../../config';
import { useContext, useState, useEffect } from 'react';
import { apiRoot } from '../../commercetools';
import AppContext from '../../appContext';

const VERBOSE = true;

function ClassPicker() {

  const [context, setContext] = useContext(AppContext);

  let [classes, setClasses] = useState([]);
  let [fetched, setFetched] = useState(false);

  const onChangeClass = (event) => {
    const id = event.target.value;
    let obj = null;
    if(id) {
      obj = classes.find(c => c.id == id);
      if(obj) {
        setContext({...context,classCode: obj.value.code, className: obj.value.name});
        return;
      }
    }
    setContext({...context,classCode: null, className: ''});
  }
  useEffect(() => {
    fetchClasses();
  });

  async function fetchClasses()  {
    // Avoid repeat calls
    if(fetched) {
      return;
    }
    setFetched(true);
 

    let res =  await apiRoot
      .customObjects().withContainer({container: 'class'})
      .get()
      .execute();
      
    if(res && res.body.results) {
      console.log('classes',res.body.results);
      setClasses(res.body.results);
    }
  };

  let options = "";
  if(classes.length) {
    options = classes.map(a => <option key={a.id} value={a.id}>{a.value.name}</option>);
  }

  let selectedClass=context.classId ? context.classId : '';

  return (
    <div>
      Class:&nbsp;&nbsp;  
      <select value={selectedClass} onChange={onChangeClass}>
        <option value="">(none selected)</option>
        {options}
      </select>
    </div>
  );
      
}

export default ClassPicker;