import { useState } from "react";
import { db } from "../firebase";
import { updateDoc, doc } from 'firebase/firestore';
import User from '../Models/User';
import CalorieBurnGoal from './Calorie';

function UserInfo() {
  const [userWeight, setUserWeight] = useState("");
  const [userHeight, setUserHeight] = useState("");
  const [userWeightGoal, setUserWeightGoal] = useState("");
  const [userDuration, setUserDuration] = useState("");
  const [userMeasure, setUserMeasure] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // To track if the form is submitted

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const username = sessionStorage.getItem("username");
    const weight = e.target.weight.value;
    const height = e.target.height.value;
    const weightGoal = e.target.weightGoal.value;
    const duration = e.target.duration.value;
    const selectedMeasure = document.querySelector('input[name="measure"]:checked')?.value;

    // Update state to pass data to CalorieBurnGoal
    setUserWeight(weight);
    setUserHeight(height);
    setUserWeightGoal(weightGoal);
    setUserDuration(duration);
    setUserMeasure(selectedMeasure);

    try {
        const user = await User.getUserByName(username);
        const userRef = doc(db, "Users", user.userID);
        const userInfo = {
            weight: weight,
            height: height,  
            weightGoal: weightGoal,
            duration: duration,
            selectedMeasure: selectedMeasure
        };
        
        await updateDoc(userRef, userInfo);
        alert("Info saved!");
        setIsFormSubmitted(true);  // Mark form as submitted
    } 
    catch(error) {
      console.error('Error signing up: ', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Tell us about your conditions</h1>
        <label>
            <h3>Conversion for measurement units below ↓</h3>
            <p>
              <input id="metricRadio" type="radio" name="measure" value="metric" onChange={() => setUserMeasure("metric")}></input>Metric
            </p>
            <p>
              <input id="imperialRadio" type="radio" name="measure" value="imperial" onChange={() => setUserMeasure("imperial")}></input>Imperial
            </p>
        </label>
        <input id="weight" type="text" name="weight" placeholder="Your current weight" required />
        <br />
        <input id="height" type="text" name="height" placeholder="Your current height" required />
        <br />
        <input id="weightGoal" type="text" name="weightGoal" placeholder="Your desired weight" required />
        <br />
        <input type="text" name="duration" placeholder="Duration (in weeks)" required />
        <br />
        <br />
        <button type="submit">Submit</button>
      </form>

      {/* Pass the state values as props to CalorieBurnGoal when the form is submitted */}
      {isFormSubmitted && (
        <CalorieBurnGoal 
          userWeight={userWeight}
          userWeightGoal={userWeightGoal}
          userDuration={userDuration}
          userMeasure={userMeasure}
        />
      )}
    </div>
  );
}

export default UserInfo;
