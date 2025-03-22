import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css' 
import SignUp from "./Pages/SignUp";
import LogIn from "./Pages/LogIn";
import UserInfo from "./Pages/UserInfo";
import Calorie from "./Pages/Calorie";
import WorkoutPlan from "./Pages/WorkoutPlan";
import MapPage from './Pages/MapPage';

function App() {
  return (
  <Router>
      <Routes>
          <Route path = "/" element = {<SignUp />}/>
          <Route path = "/login" element = {<LogIn />}/>      
          <Route path = "/info" element = {<UserInfo />}/>   
          <Route path="/calorie" element={<Calorie />} />
          <Route path="/workout-plan" element={<WorkoutPlan />} />
          <Route path="/map" element={<MapPage />} />
      </Routes>
  </Router>
  );
}

export default App
