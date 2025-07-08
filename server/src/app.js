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
app.get("/api/search", async (req, res) => {
  const { lat, lon, radius = 5000 } = req.query;
  if (!lat || !lon)
    return res.status(400).json({ error: "lat & lon required" });

  try {
    const gRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          key: process.env.GOOGLE_PLACES_KEY,
          location: `${lat},${lon}`,
          radius,
          type: "tourist_attraction",
          opennow: true,
        },
      },
    );
    res.json(gRes.data.results);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Google Places request failed" });
  }
});

/**
 * POST /api/users/:id/favourites
 * Body: { externalId, name, lat, lon }
 */
app.post("/api/users/:id/favourites", async (req, res) => {
  try {
    const fav = await prisma.favourite.create({
      data: { userId: req.params.id, ...req.body, provider: "GOOGLE" },
    });
    res.json(fav);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(4000, () => console.log("API ready on http://localhost:4000"));
