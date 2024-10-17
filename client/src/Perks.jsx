export default function Perks({selected,onChange}) {
  return (
    <>
      <label className="border p-4 flex rounded-2xl gap-2 items-center">
        <input type="checkbox" />
        <span>Fila</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center">
        <input type="checkbox" />
        <span>Perfume</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center">
        <input type="checkbox" />
        <span>Handkerchief</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center">
        <input type="checkbox" />
        <span>Cufflinks</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center">
        <input type="checkbox" />
        <span>Socks</span>
      </label>
    </>
  );
}