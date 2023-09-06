const SizePicker = ({variant, selectVariant}) => {

  let sizeStr = '';
  const sizeAttr = variant.attributes.find(a => a.name=='size');
  sizeStr = sizeAttr?.value;

  const selectThisVariant = async () => {
    console.log('SELECT THIS');
    selectVariant(variant);
  }
  return (
    <span>
      <button key={variant.id} onClick={selectThisVariant}>{ sizeStr }</button>&nbsp;
    </span>
  );
}

export default SizePicker;
