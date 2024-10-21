// eslint-disable-next-line react/prop-types
export default function Perks({selected,onChange}) {
function handleCbClick(ev) {
  const {checked, name} = ev.target;
  if (checked) {
    onChange([...selected,name]);
  } else {
    // eslint-disable-next-line react/prop-types
    onChange([...selected.filter(selectedName => selectedName !== name)]);
  }
}
  return (
    <>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
        <input type="checkbox"name="filla" onChange={handleCbClick} />
        <span>Fila</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
        <input type="checkbox"name="perfume" onChange={handleCbClick} />
        <span>Perfume</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
        <input type="checkbox"name="handkerchief" onChange={handleCbClick} />
        <span>Handkerchief</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
        <input type="checkbox"name="cufflinks" onChange={handleCbClick} />
        <span>Cufflinks</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
        <input type="checkbox"name="socks" onChange={handleCbClick} />
        <span>Socks</span>
      </label>
    </>
  );
}