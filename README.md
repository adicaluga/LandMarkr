# 🗺️ LandMarkr – Location-Based Attraction Discovery App

LandMarkr is a full-stack web application that allows users to discover nearby tourist attractions anywhere in the world using either a city search or their live geographic location.  
The project is being built incrementally to strengthen understanding of modern web development, API integration, and full-stack architecture.

This project is **actively in development** and is not yet feature-complete.

---

## 🚀 Currently Implemented Features

### 🌍 Global Location Search
- Search for tourist attractions by entering a city name (e.g., *Tokyo*, *Toronto*).
- City names are converted to geographic coordinates using the **Google Geocoding API**.

### 📍 Live Location Detection
- Uses the browser’s **Geolocation API** to detect the user’s current latitude and longitude.
- Displays nearby attractions based on the user’s real-world location.

### 🗺️ Attraction Discovery
- Fetches nearby tourist attractions using the **Google Places Nearby Search API**.
- Displays results with:
  - Attraction name
  - Photo (when available)
  - Rating and total review count
  - Open/closed status
  - Approximate address

### 🖼️ Secure Image Proxying
- Attraction photos are served through an **Express backend proxy**.
- Prevents exposure of the Google API key in the client.
- Reduces the client-side attack surface.

### 👤 Basic User Creation
- Users can create an account via a modal-based form.
- User data is stored in a PostgreSQL database using **Prisma ORM**.
- Active user state is persisted in `localStorage`.

### 🎨 Modern UI
- Modular React components (`SearchBar`, `PlaceCard`, `CreateUserModal`, `Home`)
- Scrollable results list with card-based layout
- Component-based CSS styling with a consistent visual theme

---

## 🚧 In Progress / Planned Features

- ❤️ **Favourites System**
  - Save attractions to a user’s personal favourites list
  - Backend routes and database models planned

- 🔐 **Authentication**
  - Replace localStorage-based user state with proper authentication

- 📄 **Pagination**
  - Support loading additional results using Google Places `next_page_token`

- 🎛️ **Filters**
  - Filter attractions by rating, distance, or open status

- 🚀 **Deployment**
  - Frontend: Vercel
  - Backend: Railway / Render / Fly.io

---

## 🧠 What I’ve Learned So Far

Through this project, I’ve gained hands-on experience with:

- Full-stack application architecture (client/server separation)
- RESTful API design with Express
- Integrating third-party APIs securely
- Converting user input into geographic data
- Asynchronous programming with `async/await`
- Database modeling with Prisma and PostgreSQL
- State management and persistence in React
- Component-based UI design and styling
- Environment variable management and API key protection

---

## 🛠️ Technologies Used

### Frontend
- React (Vite)
- JavaScript (ES6+)
- HTML5 / CSS3
- Browser Geolocation API

### Backend
- Node.js
- Express.js
- Axios
- Prisma ORM
- PostgreSQL

### APIs
- Google Places API
- Google Geocoding API
- Google Places Photo API (proxied)

---

## 📦 Project Structure

```text
/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── PlaceCard.jsx
│   │   │   └── CreateUserModal.jsx
│   │   ├── Home.jsx
│   │   └── styles/
│   └── README.md
│
├── server/                 # Express backend
│   ├── src/
│   │   └── app.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── .env
│
└── README.md
```

---

## 🔑 Environment Setup

This project uses Google Maps Platform APIs.

Required environment variables (server/.env):

GOOGLE_PLACES_KEY=YOUR_GOOGLE_API_KEY
DATABASE_URL=postgresql://user:password@localhost:5432/landmarkr_db

Note:
- Billing must be enabled in Google Cloud for Places and Geocoding APIs.
- The Google API key is only used on the backend and is never exposed to the client.

---

## ▶️ Running the Project Locally

Run everything from the repo root (workspace):
1. Install dependencies
2. Start both apps

Commands:
pnpm install
pnpm dev

---

Backend setup:
1. Navigate to the server directory
2. Install dependencies
3. Start the development server

Commands:
cd server
pnpm install
pnpm dev

The backend runs on:
http://localhost:4000

---

Frontend setup:
1. Navigate to the client directory
2. Install dependencies
3. Start the development server

Commands:
cd client
pnpm install
pnpm dev

The frontend runs on:
http://localhost:5173

---

## 📜 License

This project is open source and available under the MIT License.

---

## ✨ Status

Actively in development.

Features and structure may change as the project evolves.
