import { useNavigate } from "react-router-dom";
import { db } from "../firebase"
import { collection, doc, getDoc } from 'firebase/firestore';
import User from '../Models/User';

function LogIn() {
    const navigate = useNavigate();
    const handleLogIn = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
        const fetchUser = await User.getUserByName(username)

        if (!fetchUser.empty) {
            if (fetchUser.password != password) {
                alert("Password does not match!");
            }
            else {
                alert("Logged in successfully!");
                sessionStorage.setItem('username', username);
                navigate("/info");
            }
        }
        else {
            alert("Username does not exist");
        }
   
    } 
    catch(error) {
        console.error('Error logginng in: ', error);
    }
  };
    function isVisible() {
        var x = document.getElementById("password");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    }
  return (
      <form onSubmit={handleLogIn}>
            <h1>Log In</h1>
            <input type="text" name="username" placeholder="Username" required/>
            <br/>
            <input id="password" type="password" name="password" placeholder="Password" required />
            <br/>
            <label>
                <p><input type="checkbox" onClick= {isVisible}></input>Show Password</p>
            </label>
            <button type="submit">Log In</button>
            <p>Don't an account? <a href="/">Sign Up</a></p>
      </form>

  );
}

export default LogIn