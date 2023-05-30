import { useState } from 'react';
import SearchInput from './search-input';
import ProductList from './product-list';
import ContextDisplay from '../context/context-display';
import config from '../../config';


function HomePage() {

  const [isSubmitted, setSubmitted] = useState(false);
  const [search, setSearch] = useState('');
  const [scoped, setScoped] = useState(false);

  const onChangeSearch = (event) => {
    setSearch(event.target.value);
    setSubmitted(false);
  }

  const onSubmit = () => {
    setSubmitted(true);
  }

  const onSetScoped = (event) => {
    setScoped(event.target.checked == true);
  }

  const ctProject = process.env.REACT_APP_PROJECT_KEY;

  return (
    <div className="App">
      <ContextDisplay />
      <span className="small">
      Connected to commercetools project {ctProject}<br/>
      Locale: {config.locale}
      </span>
      <hr></hr>
      Enter search string to search for products:
      <p/>&nbsp;
        <SearchInput onChange={onChangeSearch} onSubmit={onSubmit} />
        <input type="checkbox" onChange={onSetScoped} /> Use Scoped Pricing <br></br>
        { isSubmitted && <ProductList search={search} scoped={scoped} /> }
      
    </div>
  );
}

export default HomePage;