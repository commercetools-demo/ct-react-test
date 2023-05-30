
const SearchInput = ({onChange, onSetScoped, onSubmit}) => {

  // Have the enter key in the search trigger the onSubmit function
  const onKeyUp = (event) => {
    if(event.key=='Enter') {
      onSubmit();
    }
  }

  return (
  <div>
    <input type="text" onChange={onChange} onKeyUp={onKeyUp} />&nbsp;
    <input type="submit" value="Search" onClick={onSubmit}/>
  </div>
  )
}

export default SearchInput;
