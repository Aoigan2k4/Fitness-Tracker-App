import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function WorkoutPlan() {
  const navigate = useNavigate();
  const location = useLocation();
  const dailyCalorieBurn = location.state?.dailyCalorieBurn || null; // Ensure it's retrieved safely

  const [exerciseType, setExerciseType] = useState("");
  const [timeNeeded, setTimeNeeded] = useState(null);

  const MET_VALUES = {
    walk: 3.8, // Walking at moderate speed
    run: 7.5,  // Running at 6 mph
  };

  useEffect(() => {
    if (exerciseType && dailyCalorieBurn) {
      calculateTimeNeeded();
    }
  }, [exerciseType, dailyCalorieBurn]);

  const calculateTimeNeeded = () => {
    if (!exerciseType || !dailyCalorieBurn) return;

    const weight = parseFloat(sessionStorage.getItem("userWeight")) || 70; // Default if missing
    const MET = MET_VALUES[exerciseType];
    const caloriesPerMinute = (MET * weight * 3.5) / 200;
    const minutesNeeded = (dailyCalorieBurn / caloriesPerMinute).toFixed(2);

    setTimeNeeded(minutesNeeded);
  };

  return (
    <div>
      <h1>Plan Your Workout</h1>
      {dailyCalorieBurn ? (
        <p>Your daily calorie burn goal is <strong>{dailyCalorieBurn}</strong> calories.</p>
      ) : (
        <p>Error: No calorie data found.</p>
      )}

      <h3>Choose Your Exercise:</h3>
      <button onClick={() => setExerciseType("walk")} style={{ margin: "10px", padding: "10px 20px" }}>
        Walk
      </button>
      <button onClick={() => setExerciseType("run")} style={{ margin: "10px", padding: "10px 20px" }}>
        Run
      </button>

      {exerciseType && <p>You chose <strong>{exerciseType === "walk" ? "Walking" : "Running"}</strong>.</p>}

      {timeNeeded !== null && <h2>You need to {exerciseType} for approximately {timeNeeded} minutes.</h2>}

      
    </div>
  );
}

export default WorkoutPlan;
