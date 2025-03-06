import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css' 
import SignUp from "./Pages/SignUp";
import LogIn from "./Pages/LogIn";

function App() {
  return (
  <Router>
      <Routes>
          <Route path = "/" element = {<SignUp />}/>
          <Route path = "/login" element = {<LogIn />}/>      
      </Routes>
  </Router>
  );
}

export default App
