//Wire the backend route
import express from "express";
import cors from "cors";
import "dotenv/config";
import axios from "axios";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Search bar
app.get("/api/search", async (req, res) => {
  const { lat, lon, radius = 5000, query, city } = req.query;

  try {
    let latNum = Number(lat), lonNum = Number(lon);

    // If no coords but we got a city, geocode it
    if ((!Number.isFinite(latNum) || !Number.isFinite(lonNum)) && city) {

      // Calling geocoding api
      const geo = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            key: process.env.GOOGLE_PLACES_KEY,
            address: city
          }
        }
      );

      if (geo.data.status !== "OK" || !geo.data.results?.[0]) {
        return res.status(404).json({ error: `Could not geocode city: ${city}` });
      }

      const loc = geo.data.results[0].geometry.location; // { lat, lng }
      latNum = loc.lat;
      lonNum = loc.lng;
    }

    // Still no coords? fail
    if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) {
      return res.status(400).json({ error: "Provide lat & lon or a city name" });
    }

    // Finally call Places Nearby
    const gRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          key: process.env.GOOGLE_PLACES_KEY,
          location: `${latNum},${lonNum}`,
          radius,
          ...(query ? { keyword: query } : {}),
          type: "tourist_attraction",
          opennow: true,
        },
      }
    );

    res.json(gRes.data.results || []);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Search failed" });
  }
});

// Proxy Google place photos so the key never hits the browser
app.get("/api/photo", async (req, res) => {
  const ref = req.query.ref;
  const maxwidth = Number(req.query.w) || 400; // optional width param
  if (!ref) return res.status(400).send("Missing photo ref");

  try {
    const gPhoto = await axios.get(
      "https://maps.googleapis.com/maps/api/place/photo",
      {
        params: {
          key: process.env.GOOGLE_PLACES_KEY,
          photoreference: ref,
          maxwidth,
        },
        responseType: "stream",
      }
    );
    res.setHeader("Content-Type", gPhoto.headers["content-type"] || "image/jpeg");
    gPhoto.data.pipe(res);
  } catch (err) {
    console.error("Photo proxy error:", err.response?.data || err.message);
    res.status(500).send("Photo fetch failed");
  }
});

/**
 * POST /api/users/:id/favourites
 * Body: { externalId, name, lat, lon }
 */

// app.post("/api/users/:id/favourites", async (req, res) => {
//   try {
//     const fav = await prisma.favourite.create({
//       // ...req bag of candy inside of bag of candy
//       data: {
//         userId: req.params.id,
//         ...req.body,
//         provider: "GOOGLE" },
//     });

//     //Send back to client as json
//     res.json(fav);
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// });

// Create a user
app.post("/api/users", async (req, res) => {
  try {
    const { email, name } = req.body;
    const user = await prisma.user.create({
      data: { email, name }
    });
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// List the users
app.get("/api/users", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



// LIST FAVOURITES
app.get("/api/users/:id/favourites", async (req, res) => {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  // Send query to favourites table
  try {
    const favs = await prisma.favourite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(favs);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load favourites" });
  }
});


// SAVE FAVOURITES
app.post("/api/users/:id/favourites", async (req, res) => {
  const userId = Number(req.params.id);

  // Checking for valid user
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  // Read json body sent by the client
  const {
    provider = "GOOGLE",
    placeId,
    name,
    address = null,
    photoRef = null,
    rating = null,
  } = req.body || {};

  if (!placeId || !name) {
    return res.status(400).json({ error: "placeId and name are required" });
  }


  try {
    // idempotent save
    const fav = await prisma.favourite.upsert({
      // Unique key
      where: { userId_provider_placeId: { userId, provider, placeId } },
      update: {},
      create: { userId, provider, placeId, name, address, photoRef, rating },
    });
    res.status(201).json(fav);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to save favourite" });
  }
});

// DELETE /api/users/:id/favourites/:provider/:placeId FAVORITES
// app.delete("/api/users/:id/favourites/:provider/:placeId", async (req, res) => {
//   const userId = Number(req.params.id);
//   if (!Number.isInteger(userId) || userId <= 0) {
//     return res.status(400).json({ error: "Invalid user id" });
//   }
//   const { provider, placeId } = req.params;

//   try {
//     const fav = await prisma.favourite.findUnique({
//       where: { userId_provider_placeId: { userId, provider, placeId } },
//     });
//     if (!fav) return res.status(404).json({ error: "Favourite not found" });

//     await prisma.favourite.delete({ where: { id: fav.id } });
//     res.json({ ok: true });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "Failed to delete favourite" });
//   }
// });

app.listen(4000, () => console.log("API ready on http://localhost:4000"));
