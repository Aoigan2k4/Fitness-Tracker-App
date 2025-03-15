import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css' 
import SignUp from "./Pages/SignUp";
import LogIn from "./Pages/LogIn";
import UserInfo from "./Pages/UserInfo";

function App() {
  return (
  <Router>
      <Routes>
          <Route path = "/" element = {<SignUp />}/>
          <Route path = "/login" element = {<LogIn />}/>      
          <Route path = "/info" element = {<UserInfo />}/>   
      </Routes>
  </Router>
  );
}

export default App
