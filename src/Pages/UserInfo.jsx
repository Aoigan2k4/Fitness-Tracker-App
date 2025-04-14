import { useState, useEffect } from "react";
import CalorieBurnGoal from "./Calorie";
import "../Styles/UserInfo.css";
function UserInfo() {
    const [userWeight, setUserWeight] = useState("");
    const [userHeight, setUserHeight] = useState("");
    const [userWeightGoal, setUserWeightGoal] = useState("");
    const [userDuration, setUserDuration] = useState("");
    const [userMeasure, setUserMeasure] = useState("");
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const username = sessionStorage.getItem("username");
            try {
                const response = await fetch(`http://localhost:5000/api/user-data?username=${encodeURIComponent(username)}`);
                const data = await response.json();
            
                if (response.ok && data.dailyCalorieBurn) {
                    console.log("User data:", data.dailyCalorieBurn);
                    setUserWeight(data.weight);
                    setUserHeight(data.height);
                    setUserWeightGoal(data.weightGoal);
                    setUserDuration(data.duration);
                    setUserMeasure(data.selectedMeasure);
                    setIsFormSubmitted(true);
                    document.getElementById("UserInfo").style.display = "none";
                }
                else if (response.ok && !data.dailyCalorieBurn) {
                    document.getElementById("UserInfo").style.display = "block";
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = sessionStorage.getItem("username");
        const weight = e.target.weight.value;
        const height = e.target.height.value;
        const weightGoal = e.target.weightGoal.value;
        const duration = e.target.duration.value;
        const selectedMeasure = document.querySelector('input[name="measure"]:checked')?.value;

        setUserWeight(weight);
        setUserHeight(height);
        setUserWeightGoal(weightGoal);
        setUserDuration(duration);
        setUserMeasure(selectedMeasure);

        try {
            const response = await fetch("http://localhost:5000/api/update-user-info", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, weight, height, weightGoal, duration, selectedMeasure }),
            });

            if (response.ok) {
                alert("Info saved!");
                setIsFormSubmitted(true);
            } else {
                const data = await response.json();
                alert(data.message || "Error saving user info");
            }
        } catch (error) {
            console.error("Error saving user info:", error);
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
        <div className="userinfo-fullscreen">
          <div className="userinfo-left">
            <div className="userinfo-overlay">
              <h1>Welcome to FitFriends 💪</h1>
              <p>Tell us about your body condition to personalize your journey!</p>
            </div>
          </div>
      
          <div className="userinfo-right">
            <form
              id="UserInfo"
              onSubmit={handleSubmit}
              className="userinfo-form"
              style={{ display: isFormSubmitted ? "none" : "block" }}
            >
              <h2>Tell us about your conditions</h2>
              <p>Conversion for measurement units below ↓</p>
      
              <div className="radio-group">
                <label>
                  <input id="metricRadio" type="radio" name="measure" value="metric" onChange={changeMeasureUnits} />
                  Metric
                </label>
                <label>
                  <input id="imperialRadio" type="radio" name="measure" value="imperial" onChange={changeMeasureUnits} />
                  Imperial
                </label>
              </div>
      
              <input id="weight" type="text" name="weight" placeholder="Your current weight" required />
              <input id="height" type="text" name="height" placeholder="Your current height" required />
              <input id="weightGoal" type="text" name="weightGoal" placeholder="Your desired weight" required onChange={weightCheck} />
              <input type="text" name="duration" placeholder="Duration (in weeks)" required />
              <button type="submit">Submit</button>
            </form>
      
            {isFormSubmitted && (
              <CalorieBurnGoal
                userWeight={userWeight}
                userWeightGoal={userWeightGoal}
                userDuration={userDuration}
                userMeasure={userMeasure}
              />
            )}
          </div>
        </div>
      );
}

export default UserInfo;