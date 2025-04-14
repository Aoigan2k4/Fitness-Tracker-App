const express = require("express");
const { getUserData, addUserData, signUp, checkUsername, updateUserInfo } = require("../controllers/firebaseController");
const router = express.Router();

// Define routes
router.get("/user-data", getUserData);
router.post("/user-data", addUserData);

// Routes for sign-up and username check
router.post("/sign-up", signUp);
router.get("/check-username", checkUsername);
router.post("/update-user-info", updateUserInfo); 

module.exports = router;