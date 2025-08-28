// client/src/favouritesApi.js
// const API_BASE = "http://localhost:4000";

// export async function listFavourites(userId) {
//   const r = await fetch(`${API_BASE}/api/users/${userId}/favourites`);
//   if (!r.ok) throw new Error("Failed to load favourites");
//   return r.json();
// }

// export async function saveFavourite(userId, payload) {
//   const r = await fetch(`${API_BASE}/api/users/${userId}/favourites`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
//   if (!r.ok) throw new Error("Failed to save favourite");
//   return r.json();
// }

// export async function deleteFavourite(userId, provider, placeId) {
//   const r = await fetch(`${API_BASE}/api/users/${userId}/favourites/${provider}/${placeId}`, {
//     method: "DELETE",
//   });
//   if (!r.ok) throw new Error("Failed to delete favourite");
//   return r.json();
// }
