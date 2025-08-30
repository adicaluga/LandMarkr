import {useEffect, useState, useMemo } from "react";
import CreateUserModal from "./components/CreateUserModal";
import "./Home.css";
import SearchBar from "./components/SearchBar";
import PlaceCard from "./components/PlaceCard";
import { listFavourites, saveFavourite, deleteFavourite } from "./Favourites.js";

export default function Home() {
  // --user state--
  const [user, setUser] = useState(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [results, setResults] = useState([]);
  const [favs, setFavs] = useState([]);
  // const [loading, setLoading] = useState(false);

  // Load saved user from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("landmarkr:user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const favKey = useMemo(
    () => new Set(favs.map(f => `${f.provider}:${f.placeId}`)),
    [favs]
  );

  useEffect(() => {
    if (!user?.id) return;
    listFavourites(user.id).then(setFavs).catch(console.error);
  }, [user?.id]);


  async function handleToggleFav(place) {
    if (!user?.id) {
      alert("Please create a user first.");
      return;
    }
    const key = `GOOGLE:${place.place_id}`;
    const isSaved = favKey.has(key);

    try {
      if (!isSaved) {
        const created = await saveFavourite(user.id, {
          provider: "GOOGLE",
          placeId: place.place_id,
          name: place.name,
          address: place.formatted_address || place.vicinity || "",
          photoRef: place.photos?.[0]?.photo_reference || null,
          rating: typeof place.rating === "number" ? place.rating : null,
        });
        setFavs(prev => [created, ...prev]); // optimistic add
      } else {
        await deleteFavourite(user.id, "GOOGLE", place.place_id);
        setFavs(prev => prev.filter(f => !(f.provider === "GOOGLE" && f.placeId === place.place_id)));
      }
    } catch (e) {
      console.error(e);
      alert("Failed to update favourite.");
    }
  }


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
                Save
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
      <SearchBar setResults={setResults}/>
      <div className="resultsWrap">
        {results.map((p) => (
          <PlaceCard
            key={p.place_id}
            place={p}
            canSave={!!user}
            saved={favKey.has(`GOOGLE:${p.place_id}`)}
            onToggleFav={() => handleToggleFav(p)}
          />
        ))}
      </div>
    </>


  );
}
