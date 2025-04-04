import { useState, useEffect } from "react";
import { db } from "../firebase";
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import User from '../Models/User';
import CalorieBurnGoal from './Calorie';

function UserInfo() {
  const [userWeight, setUserWeight] = useState("");
  const [userHeight, setUserHeight] = useState("");
  const [userWeightGoal, setUserWeightGoal] = useState("");
  const [userDuration, setUserDuration] = useState("");
  const [userMeasure, setUserMeasure] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // To track if the form is submitted
      
  const isFilled = async() => { 
    const username = sessionStorage.getItem("username");
    const info = await User.getUserData(username)

    console.log(info.dailyCalorieBurn)
    if (!info.dailyCalorieBurn) {
      document.getElementById("UserInfo").style.display = "block";
    }
    else if (info.dailyCalorieBurn) {
      document.getElementById("UserInfo").style.display = "none";

      setUserWeight(info.weight);
      setUserHeight(info.height);
      setUserWeightGoal(info.weightGoal);
      setUserDuration(info.duration);
      setUserMeasure(info.selectedMeasure);
      setIsFormSubmitted(true);
    }
  }

  useEffect(() => {
    isFilled() ;
  }, []);
 
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

  function changeMeasureUnits() {
    var weight = document.getElementById("weight").value
    var height = document.getElementById("height").value
    var weightGoal = document.getElementById("weightGoal").value

    const isMetric = document.getElementById('metricRadio').checked;
    const isImperial = document.getElementById('imperialRadio').checked;

    if (isMetric) {
      setUserMeasure(document.getElementById('metricRadio').value)
    }
    else if (isImperial) {
      setUserMeasure(document.getElementById('imperialRadio').value)
    }
    
    if (weight && weightGoal && height) {
      document.getElementById("weight").value = weightConversion(weight)
      document.getElementById("weightGoal").value = weightConversion(weightGoal)
      document.getElementById("height").value = heightConversion(height)
    }
    else {
      return
    }
  }

  function weightConversion (weight){
    const isMetric = document.getElementById('metricRadio').checked;
    const isImperial = document.getElementById('imperialRadio').checked;
    var result;

    if (isMetric) {
      result = parseFloat((weight) / 2.205).toFixed(2);
      return result
    }
    else if (isImperial) {
      result = parseFloat((weight) * 2.205).toFixed(2);
      return result
    }
  }

  function heightConversion (height){
    const isMetric = document.getElementById('metricRadio').checked;
    const isImperial = document.getElementById('imperialRadio').checked;
    var result;

    if (isImperial) {
      const numHeight = parseFloat(height);
      let ft = Math.floor(numHeight / 30.48);  
      let inch = Math.round((numHeight % 30.48) / 2.54); 

      if (inch >= 12) {
        inch -= 12;
        ft += 1;
      }

      result = `${ft}'${inch}`;
      return result;
    }
    else if (isMetric) {
      const heightArray = height.split("'");
      let ft = parseFloat(heightArray[0]);
      let inch = parseFloat(heightArray[1]);
    
      result = ((ft * 30.48) + (inch * 2.54)).toFixed(2)
      return result;
    }
  }

  function weightCheck(){
    const weight = document.getElementById("weight").value
    const weightGoal = document.getElementById("weightGoal").value
    if (weightGoal >= weight) {
      alert("Your goal weight should be less than your current weight to proceed. Please adjust your target.");
      document.getElementById("weightGoal").value = "";
    }
  }

  return (
    <div>
      <form id = "UserInfo" onSubmit={handleSubmit}
       style={{ display: 'none' }}>
        <h1>Tell us about your conditions</h1>
        <label>
            <h3>Conversion for measurement units below ↓</h3>
            <p>
            <p><input id="metricRadio" type="radio" name="measure" value="metric" onChange={changeMeasureUnits}></input>Metric</p>
            </p>
            <p>
            <p><input id="imperialRadio" type="radio" name="measure" value="imperial" onChange={changeMeasureUnits}></input>Imperial</p>
            </p>
        </label>
        <input id="weight" type="text" name="weight" placeholder="Your current weight" required />
        <br />
        <input id="height" type="text" name="height" placeholder="Your current height" required />
        <br />
        <input id="weightGoal" type="text" name="weightGoal" placeholder="Your desired weight" required onChange={weightCheck}/>
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