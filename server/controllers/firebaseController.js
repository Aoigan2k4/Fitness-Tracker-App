const admin = require("../config/firebaseConfig");

// Fetch user data from Firebase
const getUserData = async (req, res) => {
  try {
    const { username } = req.query; // Get username from request parameters
    const userRef = admin.firestore().collection("Users");
    const querySnapshot = await userRef.where("username", "==", username).get();

    if (querySnapshot.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    const userDoc = querySnapshot.docs[0];
    res.status(200).json(userDoc.data());
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: error.message });
  }
};

const addUserData = async (req, res) => {
  try {
    const { userId, data } = req.body; 
    const userRef = admin.firestore().collection("Users").doc(userId);
    await userRef.set(data);

    res.status(201).json({ message: "User data added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sign-up endpoint logic
const signUp = async (req, res) => {
  const { userId , username, email, password } = req.body;

  try {
    const userRef = admin.firestore().collection("Users").doc(userId);
    const doc = await userRef.get();

    if (doc.exists) {
      return res.status(400).json({ message: "Username is already taken!" });
    }

    await userRef.set({ userId, username, email, password });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check if username is taken
const checkUsername = async (req, res) => {
  const { username } = req.query;

  try {
    const userRef = admin.firestore().collection("Users");
    const querySnapshot = await userRef.where("username", "==", username).limit(1).get();

    const isTaken = !querySnapshot.empty;
    res.status(200).json({ isTaken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const { username, weight, height, weightGoal, duration, selectedMeasure, dailyCalorieBurn } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const userRef = admin.firestore().collection("Users");
    const querySnapshot = await userRef.where("username", "==", username).get();

    if (querySnapshot.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    const userDoc = querySnapshot.docs[0];
    const updatedData = {};

    if (weight) updatedData.weight = weight;
    if (height) updatedData.height = height;
    if (weightGoal) updatedData.weightGoal = weightGoal;
    if (duration) updatedData.duration = duration;
    if (selectedMeasure) updatedData.selectedMeasure = selectedMeasure;
    if (dailyCalorieBurn) updatedData.dailyCalorieBurn = dailyCalorieBurn;
    
    await userDoc.ref.update(updatedData);

    res.status(200).json({ message: "User info updated successfully", updatedData });
  } catch (error) {
    console.error("Error updating user info:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { getUserData, addUserData, signUp, checkUsername, updateUserInfo };