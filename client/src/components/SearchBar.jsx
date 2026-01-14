import { useState } from "react";
import "./SearchBar.css";


export default function SearchBar({ setResults }) {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function fetchResults(url) {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
      }
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
      if (!data?.length) setMsg("No attractions found for that area.");
    } catch (err) {
      setResults([]);
      setMsg(String(err.message || err));
    } finally {
      setLoading(false);
    }
// ADD THE REST HERE
  }

  // Submit with city name (server will geocode)
  async function onSubmit(e) {
    e.preventDefault();
    if (!city.trim()) {
      setMsg("Enter a city or use your location.");
      return;
    }
    const url = new URL("http://localhost:4000/api/search");
    url.searchParams.set("city", city.trim());
    url.searchParams.set("radius", "5000");
    // If you later add a keyword input, set url.searchParams.set("query", keyword)
    fetchResults(url.toString());
  }

  // Use browser geolocation to get nearby attractions
  function useMyLocation() {
    setMsg("");
    if (!("geolocation" in navigator)) {
      setMsg("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const url = new URL("http://localhost:4000/api/search");
        url.searchParams.set("lat", String(coords.latitude));
        url.searchParams.set("lon", String(coords.longitude));
        url.searchParams.set("radius", "5000");
        fetchResults(url.toString());
      },
      (err) => {
        // Common cases: permission denied, insecure origin, or timeout
        setMsg(err.message || "Unable to get your location.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div className="sb-wrap">
      <form className="sb-form" onSubmit={onSubmit}>
        <input
          type="text"
          className="sb-input"
          placeholder="Search for your city (e.g., Toronto, Tokyo)…"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" className="sb-btn" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
        <button type="button" className="sb-btn secondary" onClick={useMyLocation} disabled={loading} title="Use my location">Use my location</button>
      </form>
      {msg && <div className="sb-msg">{msg}</div>}
    </div>
  );
}
