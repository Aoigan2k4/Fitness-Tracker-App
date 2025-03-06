import { useNavigate } from "react-router-dom";
import { db } from "../firebase"
import { setDoc, doc } from 'firebase/firestore';
import User from '../Models/User';

function SignUp() {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault(); 
  
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const addUser = new User(username, email, password);
    try {
      await setDoc(doc(db, "Users", username), addUser.addUser());
      navigate("/login");
    } 
    catch(error) {
      console.error('Error signing up: ', error);
    }
  };

  return (
      <form onSubmit = {handleSubmit}>
        <h1>Sign Up</h1>
        <input type="text" name="username" placeholder="Username" required/>
        <br/>
        <input type="email" name="email" placeholder="Email" required/>
        <br/>
        <input type="password" name="password" placeholder="Password" required/>
        <br/>
        <button type="submit">Sign Up</button>
      </form>
  )
}

export default SignUp