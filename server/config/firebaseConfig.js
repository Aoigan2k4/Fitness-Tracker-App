// filepath: server/config/firebaseConfig.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-vite-239f1.firebaseio.com", 
});

module.exports = admin;