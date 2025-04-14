import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Styles/WorkoutPlan.css";
import workoutImage from "../Assets/WorkoutPlan.png";

function WorkoutPlan() {
  const navigate = useNavigate();
  const location = useLocation();

  const [dailyCalorieBurn, setDailyCalorieBurn] = useState(null);
  const [exerciseType, setExerciseType] = useState("");
  const [timeNeeded, setTimeNeeded] = useState(null);

  const getDailyCalorieBurn = async () => {
    const username = sessionStorage.getItem("username");
    try {
      const response = await fetch(`http://localhost:5000/api/user-data?username=${encodeURIComponent(username)}`);
      const data = await response.json();

      if (response.ok) {
        setDailyCalorieBurn(data.dailyCalorieBurn);
      } else {
        alert(data.message || "Error fetching calorie data");
      }
    } catch (error) {
      console.error("Error fetching calorie data:", error);
    }
  };

  const MET_VALUES = {
    walk: 3.8,
    run: 7.5,
  };

  useEffect(() => {
    getDailyCalorieBurn();
  }, []);

  useEffect(() => {
    if (exerciseType && dailyCalorieBurn) {
      calculateTimeNeeded();
    }
  }, [exerciseType, dailyCalorieBurn]);

  const calculateTimeNeeded = () => {
    if (!exerciseType || !dailyCalorieBurn) return;
    const weight = parseFloat(sessionStorage.getItem("userWeight")) || 70;
    const MET = MET_VALUES[exerciseType];
    const caloriesPerMinute = (MET * weight * 3.5) / 200;
    const minutesNeeded = (dailyCalorieBurn / caloriesPerMinute).toFixed(2);
    setTimeNeeded(minutesNeeded);
  };

  return (
    <div className="workout-page">
      <div className="workout-content">
        <img src={workoutImage} alt="Workout Icon" className="workout-top-image" />
        <h1>Plan Your Workout</h1>
  
        {dailyCalorieBurn ? (
          <p>Your daily calorie burn goal is <strong>{dailyCalorieBurn}</strong> calories.</p>
        ) : (
          <p>Error: No calorie data found.</p>
        )}
  
        <h3>Choose Your Exercise:</h3>
        <div className="exercise-buttons">
          <button onClick={() => setExerciseType("walk")}>Walk</button>
          <button onClick={() => setExerciseType("run")}>Run</button>
        </div>
  
        {exerciseType && (
          <p>You chose <strong>{exerciseType === "walk" ? "Walking" : "Running"}</strong>.</p>
        )}
  
        {timeNeeded !== null && (
          <h2>You need to {exerciseType} for approximately {timeNeeded} minutes.</h2>
        )}
  
        {exerciseType !== null && (
          <button
            className="route-button"
            onClick={() => navigate("/map", { state: { exerciseType } })}
            disabled={!exerciseType} // Disable the button if exerciseType is empty or null
          >
          Prepare your route
        </button>
      )}
      </div>
    </div>
  );
  
}

export default WorkoutPlan;
