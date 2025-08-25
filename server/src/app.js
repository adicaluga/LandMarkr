//Wire the backend route
import express from "express";
import cors from "cors";
import "dotenv/config";
import axios from "axios";
import pkg from "@prisma/client"; // 👈 default-import the whole module
const { PrismaClient } = pkg; //    then pull out PrismaClient

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

/**
 * GET /api/search?lat=43.7&lon=-79.4&radius=5000
 * Returns Google Places tourist attractions that are open now.
 *
 *
 *
 * http://localhost:4000/api/search?lat=43.7&lon=-79.4&radius=5000

 */

//https://www.youtube.com/watch?v=SccSCuHhOw0&ab_channel=WebDevSimplified
// app.get("/api/search", async (req, res) => {
//   const { lat, lon, radius = 5000, query } = req.query;
//   if (!lat || !lon)
//     return res.status(400).json({ error: "lat & lon required" });

//   try {
//     // Send a req to google places api
//     const gRes = await axios.get(
//       "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
//       {
//         params: {
//           key: process.env.GOOGLE_PLACES_KEY,
//           location: `${lat},${lon}`,
//           radius,
//           ...(query ? { keyword: query } : {}),
//           type: "tourist_attraction",
//           opennow: true,
//         },
//       },
//     );
//     res.json(gRes.data.results);
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     res.status(500).json({ error: "Google Places request failed" });
//   }
// });



// Could bring back
app.get("/api/search", async (req, res) => {
  const { lat, lon, radius = 5000, query, city } = req.query;

  try {
    let latNum = Number(lat), lonNum = Number(lon);

    // If no coords but we got a city, geocode it
    if ((!Number.isFinite(latNum) || !Number.isFinite(lonNum)) && city) {
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

app.listen(4000, () => console.log("API ready on http://localhost:4000"));
