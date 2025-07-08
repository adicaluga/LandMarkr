import { useState } from "react";

export default function SearchDemo() {
  const [results, setResults] = useState([]);

  async function find() {
    const res = await fetch(
      "http://localhost:4000/api/search?lat=43.6532&lon=-79.3832&radius=5000",
    );
    setResults(await res.json());
  }

  return (
    <>
      <button onClick={find}>Find Attractions</button>
      <ul>
        {results.map((p) => (
          <li key={p.place_id}>{p.name}</li>
        ))}
      </ul>
    </>
  );
}
