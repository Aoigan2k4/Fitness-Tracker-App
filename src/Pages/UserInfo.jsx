import { db } from "../firebase"
import { updateDoc, doc } from 'firebase/firestore';
import User from '../Models/User';

function UserInfo() {

  const handleSubmit = async (e) => {
    e.preventDefault(); 
  
    const username = sessionStorage.getItem("username");
    const weight = e.target.weight.value;
    const height = e.target.height.value;
    const weightGoal = e.target.weightGoal.value;
    const duration = e.target.duration.value;
    const selectedMeasure = document.querySelector('input[name="measure"]:checked')?.value;

    try {
        const user = await User.getUserByName(username);
        const userRef = doc(db, "Users", user.userID);
        const userInfo = {
            weight: weight,
            heights: height,
            weightGoal: weightGoal,
            duration: duration,
            selectedMeasure: selectedMeasure
          };
        
          await updateDoc (userRef, userInfo);
        alert("Info saved!")
    } 
    catch(error) {
      console.error('Error signing up: ', error);
    }
  };

  function changeMeasureUnits() {
    var weight = document.getElementById("weight").value
    var height = document.getElementById("height").value
    var weightGoal = document.getElementById("weightGoal").value
    
    if (weight && weightGoal && height) {
      document.getElementById("weight").value = weightConversion(weight)
      document.getElementById("weightGoal").value = weightConversion(weightGoal)
      document.getElementById("height").value = heightConversion(height)
    }
    // else {
    //   document.getElementById('metricRadio').checked = false;
    //   document.getElementById('imperialRadio').checked = false;
    //   alert("Missing fields!")
    // }
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

  return (
      <form onSubmit = {handleSubmit}>
        <h1>Tell us about your conditions</h1>
        <label>
            <h3>Conversion for measurement units below ↓</h3>
            <p><input id="metricRadio" type="radio" name="measure" value="metric" onChange={changeMeasureUnits}></input>Metric</p>
            <p><input id="imperialRadio" type="radio" name="measure" value="imperial" onChange={changeMeasureUnits}></input>Imperial</p>
        </label>
        <input  id="weight" type="text" name="weight" placeholder="Your current weight" required/>
        <br/>
        <input id="height" type="text" name="height" placeholder="Your current height" required/>
        <br/>
        <input id="weightGoal" type="text" name="weightGoal" placeholder="Your desired weight" required/>
        <br/>
        <input type="text" name="duration" placeholder="Duration (in weeks)" required/>
        <br/>
        <br/>
        <button type="submit">Submit</button>
        
      </form>
  )
}

export default UserInfo