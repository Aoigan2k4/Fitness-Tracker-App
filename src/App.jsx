import { useState } from 'react'
import db from "./firebase"
import { collection, addDoc } from 'firebase/firestore';
import './App.css'

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc (collection(db, "Users"), {
        email,
        password, 
    });
    setEmail("")
    setPassword("")
    alert("User successfully added");
    } 
    catch(error) {
      console.error('Error registering: ', error);
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br/>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br/>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default App
