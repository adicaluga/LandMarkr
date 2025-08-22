import {useEffect, useState } from "react";
import CreateUserModal from "./components/CreateUserModal";
import "./Home.css";
import SearchBar from "./components/SearchBar";

export default function Home() {
  // --user state--
  const [user, setUser] = useState(null);
  const [showCreateUser, setShowCreateUser] = useState(false);

  // const [results, setResults] = useState([]);
  // const [loading, setLoading] = useState(false);

  // Load saved user from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("landmarkr:user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Create a user via backend

 // Fetch request to the backend
  // async function find() {
  //   try {
  //     const res = await fetch(
  //       "http://localhost:4000/api/search?lat=43.6532&lon=-79.3832&radius=5000"
  //     );
  //     const data = await res.json();
  //     setResults(data);
  //     // waits for browser to finish reading and turning the response into a real JS object

  //     // now setResults is called with actual attraction data, and React updates the page
  //   } catch (e) {
  //     console.error(e);
  //     setResults([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  const userBadge = user ? `User #${user.id} — ${user.email}` : "No user yet";

  // Put into css file
  return (
    <>
      {/* --- Create User --- */}
      <section className="userSection">
        <h3>LandMarkr</h3>
        <div className="userBadge">{userBadge}</div>
        <div className="createButton">
          {/* Small inline style here for layout only; move to CSS if you prefer */}
          <button onClick={() => setShowCreateUser(true)}>
            {user ? "Create Another User" : "Create User"}
          </button>
          {user && (
            <button onClick={() => {localStorage.removeItem("landmarkr:user"); setUser(null);}}>
              Sign Out
            </button>
          )}
        </div>
      </section>

      {/* Find Attractions
        <section>
          <button onClick={find} disabled={loading}>
            {loading ? "Loading..." : "Find Attractions"}
          </button>
          <ul className="list">
            {results.map((p) => (
              <li key={p.place_id}>
                {p.name}
                <button
                  className="saveBtn"
                  disabled={!user}
                  title={!user ? "Create a user first" : "Save (coming soon)"}
                  onClick={() => alert("Save to favourites coming soon")}
                >
                  ❤️ Save
                </button>
              </li>
            ))}
          </ul>
        </section>
      */}

      {/* Modal */}
      <CreateUserModal
        open={showCreateUser}
        onClose={() => setShowCreateUser(false)}
        onCreated={(u) => setUser(u)}
      />

      {/*Search Bar */}
      {/* <SearchBar setResults={setResults}/>
        <ul>
          {results.map((p) => (
            <li key={p.place_id}>{p.name}</li>
          ))}
        </ul>*/}
    </>


  );
}
