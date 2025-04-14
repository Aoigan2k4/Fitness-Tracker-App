import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/CalorieBurnGoal.css"; // CSS
import calorieIcon from "../Assets/Calorie.png"; // 👈 Fix: used below

function CalorieBurnGoal({ userWeight, userWeightGoal, userDuration, userMeasure }) {
  const navigate = useNavigate();
  const [caloriesToBurn, setCaloriesToBurn] = useState(null);

  useEffect(() => {
    if (!userWeight || !userWeightGoal || !userDuration || !userMeasure) {
      setCaloriesToBurn(null);
      return;
    }

    const durationWeeks = parseInt(userDuration);
    if (isNaN(durationWeeks) || durationWeeks <= 0) {
      console.error("Invalid duration:", userDuration);
      setCaloriesToBurn(null);
      return;
    }

    const durationDays = durationWeeks * 7;
    let totalCaloriesNeeded;

    if (userMeasure === "metric") {
      totalCaloriesNeeded = (userWeight - userWeightGoal) * 7700;
    } else {
      totalCaloriesNeeded = (userWeight - userWeightGoal) * 3500;
    }

    const dailyCalorieBurn = (totalCaloriesNeeded / durationDays).toFixed(2);

    const updateCalorieData = async () => {
      try {
        const username = sessionStorage.getItem("username");
        if (!username) throw new Error("User not found in sessionStorage");

        const responseData = await fetch(
          `http://localhost:5000/api/user-data?username=${encodeURIComponent(username)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!responseData.ok) {
          const errorData = await responseData.json();
          throw new Error(errorData.message || "Error fetching user data");
        }

        const userData = await responseData.json();

        if (userData.dailyCalorieBurn) {
          setCaloriesToBurn(userData.dailyCalorieBurn);
          console.log("Calorie data fetched from database:", userData.dailyCalorieBurn);
        } else {
          setCaloriesToBurn(dailyCalorieBurn);
          console.log("Calculated and updating calorie data:", dailyCalorieBurn);

          const updateResponse = await fetch("http://localhost:5000/api/update-user-info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, dailyCalorieBurn }),
          });

          const updateData = await updateResponse.json();
          if (!updateResponse.ok) {
            throw new Error(updateData.message || "Error updating calorie data");
          }
        }
      } catch (error) {
        console.error("Error updating calorie data:", error);
      }
    };

    updateCalorieData();
  }, [userWeight, userWeightGoal, userDuration, userMeasure]);

  return (
    <div className="calorie-content">
      <img src={calorieIcon} alt="Calorie Goal Icon" className="calorie-top-image" />
      <h1>Calorie Burn Goal</h1>
      {caloriesToBurn !== null ? (
        <h2>You need to burn approximately {caloriesToBurn} calories per day.</h2>
      ) : (
        <h2 style={{ color: "#d84c4c" }}>Invalid data provided</h2>
      )}

      <div className="calorie-buttons">
        <button onClick={() => navigate("/workout-plan")}>Plan Your Workout</button>
        <button onClick={() => navigate("/schedule-management")}>Plan Your Schedule</button>
      </div>
    </div>
  );
}

export default CalorieBurnGoal;
