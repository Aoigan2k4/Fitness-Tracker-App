import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // Import navigation hook
import { db } from "../firebase";  
import { updateDoc, doc } from "firebase/firestore";
import User from "../Models/User";

function CalorieBurnGoal({ userWeight, userWeightGoal, userDuration, userMeasure }) {
  const navigate = useNavigate();  // Hook to navigate between pages

  console.log("Received data in CalorieBurnGoal:", { userWeight, userWeightGoal, userDuration, userMeasure });

  const [caloriesToBurn, setCaloriesToBurn] = useState(null);

  useEffect(() => {
    if (!userWeight || !userWeightGoal || !userDuration || !userMeasure) {
      setCaloriesToBurn(null);
      return;
    }

    // Convert userDuration to a number
    const durationWeeks = parseInt(userDuration);
    if (isNaN(durationWeeks) || durationWeeks <= 0) {
      console.error("Invalid duration:", userDuration);
      setCaloriesToBurn(null);
      return;
    }

    console.log("Calculating calories with:", { userWeight, userWeightGoal, durationWeeks, userMeasure });

    const durationDays = durationWeeks * 7;
    let totalCaloriesNeeded;

    if (userMeasure === "metric") {
      totalCaloriesNeeded = (userWeight - userWeightGoal) * 7700;
    } else {
      totalCaloriesNeeded = (userWeight - userWeightGoal) * 3500;
    }

    const dailyCalorieBurn = (totalCaloriesNeeded / durationDays).toFixed(2);
    console.log("Total Calories Needed:", totalCaloriesNeeded);
    console.log("Daily Calorie Burn:", dailyCalorieBurn);
    setCaloriesToBurn(dailyCalorieBurn);

    // Update Firestore with calorie data
    const updateFirestore = async () => {
      try {
        const username = sessionStorage.getItem("username");
        if (!username) throw new Error("User not found in sessionStorage");

        const user = await User.getUserByName(username);
        if (!user) throw new Error("User not found in Firestore");

        const userRef = doc(db, "Users", user.userID);
        await updateDoc(userRef, { dailyCalorieBurn });

        console.log("Successfully updated Firestore with calorie burn data.");
      } catch (error) {
        console.error("Error updating Firestore:", error);
      }
    };

    updateFirestore();

  }, [userWeight, userWeightGoal, userDuration, userMeasure]);

  return (
    <div>
      <h1>Calorie Burn Goal</h1>
      {caloriesToBurn !== null ? (
        <h2>You need to burn approximately {caloriesToBurn} calories per day.</h2>
      ) : (
        <h2>Invalid data provided</h2>
      )}

      {/* Button to navigate to Workout Plan page */}
      <button onClick={() => navigate("/workout-plan")} style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}>
        Plan Your Workout
      </button>
    </div>
  );
}

export default CalorieBurnGoal;
