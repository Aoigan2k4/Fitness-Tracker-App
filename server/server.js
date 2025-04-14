// filepath: server/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const firebaseRoutes = require("./routes/firebaseRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", firebaseRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});