import { useState } from "react";
import "./SearchBar.css";


export default function SearchBar({ setResults}) {
  const [searchTerm, setSearchTerm] = useState("");

  async function searchHandle(e){
    e.preventDefault();

    if (!searchTerm.trim()) return;

    try {
      const res = await fetch(`http://localhost:4000/api/search?lat=43.6532&lon=-79.3832&radius=5000&query=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      setResults(data); // Update parent with results
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form className="search-bar-container" onSubmit={searchHandle}>
      <input
        type="text"
        placeholder="Search attractions..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit" className="search-button">Search</button>
    </form>
  );
}
