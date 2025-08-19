import {useEffect, useState } from "react";

export default function SearchDemo() {
  // --user state--
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [userMsg, setUserMsg] = useState("");

  // --- places state ---
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load saved user from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("landmarkr:user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Create a user via backend
   async function createUser(e) {
     e.preventDefault();
     setUserMsg("");
     if (!email.trim()) {
       setUserMsg("Email is required.");
       return;
     }
     try {
       const res = await fetch("http://localhost:4000/api/users", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ email: email.trim(), name: name.trim() || undefined }),
       });
       if (!res.ok) {
         const err = await res.json().catch(() => ({}));
         throw new Error(err.error || `Request failed (${res.status})`);
       }
       const newUser = await res.json();
       setUser(newUser);
       localStorage.setItem("landmarkr:user", JSON.stringify(newUser));
       setUserMsg(`Created user #${newUser.id}`);
       setEmail("");
       setName("");
     } catch (err) {
       setUserMsg(String(err.message || err));
     }
   }

  // Fetch request to the backend
  async function find() {
    try {
      const res = await fetch(
        "http://localhost:4000/api/search?lat=43.6532&lon=-79.3832&radius=5000"
      );
      const data = await res.json();
      setResults(data);
      // waits for browser to finish reading and turning the response into a real JS object

      // now setResults is called with actual attraction data, and React updates the page
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  const userBadge = user ? `User #${user.id} — ${user.email}` : "No user yet";

  // Put into css file
  return (
      <>
        {/* --- Create User --- */}
        <section style={{ marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #ddd" }}>
          <h3>Create a User</h3>
          <form onSubmit={createUser} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Display name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button type="submit">Create</button>
            <span style={{ marginLeft: 8, color: userMsg?.startsWith("Created") ? "green" : "crimson" }}>
              {userMsg}
            </span>
          </form>
          <div style={{ marginTop: 6, fontSize: 12, color: "#555" }}>{userBadge}</div>
        </section>

        {/* --- Find Attractions --- */}
        <section>
          <button onClick={find} disabled={loading}>
            {loading ? "Loading..." : "Find Attractions"}
          </button>
          <ul>
            {results.map((p) => (
              <li key={p.place_id}>
                {p.name}
                {/* Placeholder "Save" button for later — needs Favourite model */}
                <button
                  style={{ marginLeft: 8 }}
                  disabled={!user} // require a user first
                  title={!user ? "Create a user first" : "Save (coming soon)"}
                  onClick={() => alert("Save to favourites coming soon")}
                >
                  ❤️ Save
                </button>
              </li>
            ))}
          </ul>
        </section>
      </>
    );
  }
