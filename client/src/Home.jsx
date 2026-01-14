import {useEffect, useState, useMemo } from "react";
import CreateUserModal from "./components/CreateUserModal";
import "./Home.css";
import SearchBar from "./components/SearchBar";
import PlaceCard from "./components/PlaceCard";
import { listFavourites, saveFavourite, deleteFavourite } from "./Favourites.js";
import Filters from "./components/Filters";

export default function Home() {
  // --user state--
  const [user, setUser] = useState(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [results, setResults] = useState([]);
  const [favs, setFavs] = useState([]);

  // NEW: view + favourites loading/error
  const [view, setView] = useState("results"); // "results" | "favourites"
  const [favLoading, setFavLoading] = useState(false);
  const [favError,   setFavError]   = useState(null);

  const [filters, setFilters] = useState({
    openNow: true,   // default matches your current server behavior
    minRating: 0,    // 0 = any
    radius: 5000,    // meters
  });


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

  // NEW: show favourites handler
  async function handleShowFavourites() {
    if (!user?.id) {
      alert("Please create a user first.");
      return;
    }
    try {
      setFavError(null);
      setFavLoading(true);
      const latest = await listFavourites(user.id);
      setFavs(latest);
      setView("favourites");
    } catch (e) {
      console.error(e);
      setFavError("Failed to load favourites.");
    } finally {
      setFavLoading(false);
    }
  }

  // helper to reuse PlaceCard for favourites
  function favToPlace(f) {
    return {
      place_id: f.placeId,
      name: f.name,
      formatted_address: f.address || "",
      rating: typeof f.rating === "number" ? f.rating : undefined,
      photos: f.photoRef ? [{ photo_reference: f.photoRef }] : undefined,
    };
  }

  const userBadge = user ? `User #${user.id} — ${user.email}` : "No user yet";

  return (
    <>
      {/* --- Create User --- */}
      <section className="userSection">
        <h3 className="title">LandMarkr</h3>
        <div className="userBadge">{userBadge}</div>
        <div className="createButton">
          <button onClick={() => setShowCreateUser(true)}>
            {user ? "Create Another User" : "Create User"}
          </button>
          {user && (
            <button
              onClick={() => {
                localStorage.removeItem("landmarkr:user");
                setUser(null);
                setFavs([]);
                setView("results");
              }}
              className="signOut"
            >
              Sign Out
            </button>
          )}
        </div>
      </section>

      {/* Search Bar */}
      <SearchBar setResults={setResults} filters={filters} />
      <Filters value={filters} onChange={setFilters} />

      {/* NEW: toolbar */}
      <div className="toolbar" style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <button
          onClick={() => setView("results")}
          disabled={view === "results"}
          title="Show search results"
        >
          Results
        </button>

        <button
          onClick={handleShowFavourites}
          disabled={!user || view === "favourites"}
          title={!user ? "Create a user first" : "Show your favourites"}
        >
          ❤️ Favourites
        </button>
      </div>

      {/* Results view */}
      {view === "results" && (
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
      )}

      {/* Favourites view */}
      {view === "favourites" && (
        <section className="resultsWrap">
          {favLoading && <div>Loading favourites…</div>}
          {favError && <div className="error">{favError}</div>}
          {!favLoading && !favError && favs.length === 0 && (
            <div>No favourites yet. Click 🤍 on a place to save it.</div>
          )}
          {!favLoading && !favError && favs.map((f) => {
            const place = favToPlace(f);
            return (
              <PlaceCard
                key={`${f.provider}:${f.placeId}`}
                place={place}
                canSave={!!user}
                saved={true}
                onToggleFav={() => handleToggleFav(place)}
              />
            );
          })}
        </section>
      )}

      {/* Modal */}
      <CreateUserModal
        open={showCreateUser}
        onClose={() => setShowCreateUser(false)}
        onCreated={(u) => setUser(u)}
      />
    </>
  );
}
