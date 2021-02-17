import { useState } from 'react';
import SearchInput from './search-input';
import ProductList from './product-list';
import ContextDisplay from '../context/context-display';

function SearchPage() {

  const [isSubmitted, setSubmitted] = useState(false);
  const [search, setSearch] = useState('');

  const onChangeSearch = (event) => {
    setSearch(event.target.value);
    setSubmitted(false);
  }

  const onSubmit = () => {
    setSubmitted(true);
  }

  return (
    <div className="App">
      <ContextDisplay />
      Enter search string to search for products:
      <p/>&nbsp;
        <SearchInput onChange={onChangeSearch} onSubmit={onSubmit} />
        { isSubmitted && <ProductList search={search} /> }
      
    </div>
  );
}

export default SearchPage;