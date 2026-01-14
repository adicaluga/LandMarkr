import "./Filters.css";

export default function Filters({ value, onChange }) {
  // value = { openNow: boolean, minRating: number, radius: number }
  function update(patch) {
    onChange({ ...value, ...patch });
  }

  return (
    <div className="filters" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", margin: "12px 0" }}>
      <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={value.openNow}
          onChange={(e) => update({ openNow: e.target.checked })}
        />
        Open now
      </label>

      <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
        Min rating:
        <select
          value={value.minRating}
          onChange={(e) => update({ minRating: Number(e.target.value) })}
        >
          <option value={0}>Any</option>
          <option value={3.5}>3.5+</option>
          <option value={4.0}>4.0+</option>
          <option value={4.3}>4.3+</option>
          <option value={4.5}>4.5+</option>
        </select>
      </label>

      <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
        Radius:
        <select
          value={value.radius}
          onChange={(e) => update({ radius: Number(e.target.value) })}
        >
          <option value={2000}>2 km</option>
          <option value={3000}>3 km</option>
          <option value={5000}>5 km</option>
          <option value={8000}>8 km</option>
          <option value={10000}>10 km</option>
        </select>
      </label>
    </div>
  );
}
