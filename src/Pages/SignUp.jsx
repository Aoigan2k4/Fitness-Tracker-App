import { useNavigate } from "react-router-dom";
import { db } from "../firebase"
import { setDoc, doc } from 'firebase/firestore';
import User from '../Models/User';
import { useState } from 'react'

function SignUp() {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const userId = crypto.randomUUID();

    const newUser = new User(userId, username, email, password);
    try {
      await setDoc(doc(db, "Users", userId), newUser.addUser());
      navigate("/login");
    } 
    catch(error) {
      console.error('Error signing up: ', error);
    }
  };

  function isVisible() {
    var pwd = document.getElementById("password");
    if (pwd.type === "password") {
      pwd.type = "text";
    } else {
      pwd.type = "password";
    }
  }

  async function isTaken() {
    var input = document.getElementById("username");
    var user = await User.getUserByName(input.value); 

    if (user !== null) {
      alert("Username is already taken!");
    }
  }


  return (
      <form onSubmit = {handleSubmit}> 
        <h1>Sign Up</h1>
        <input id="username" type="text" name="username" placeholder="Username" onInput={isTaken} required/>
        <br/>
        <input type="email" name="email" placeholder="Email" required/>
        <br/>
        <input id="password" type="password" name="password" minLength={8} placeholder="Password" required/>
        <label>
            <p><input type="checkbox" onClick={isVisible}></input>Show Password</p>
        </label>
        <button type="submit">Sign Up</button>
        
        <p>Has an account? <a href="/login">Log In</a></p>
      </form>
  );
}

export default SignUp