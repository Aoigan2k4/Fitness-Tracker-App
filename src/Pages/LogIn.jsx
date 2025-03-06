import { useNavigate } from "react-router-dom";
import { db } from "../firebase"
import { collection, doc, getDoc } from 'firebase/firestore';
import User from '../Models/User';

function LogIn() {

  const handleLogIn = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
        const ref = doc(db, "Users", username);
        const snapShot = await getDoc(ref);

        if (snapShot.exists()) {
            const fetchUser = User.getUser(snapShot);
            if (fetchUser.password != password) {
                alert("Password does not match!");
            }
            else {
                alert("Logged in successfully!");
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

  return (
      <form onSubmit={handleLogIn}>
            <h1>Log In</h1>
            <input type="text" name="username" placeholder="Username" required/>
            <br/>
            <input type="password" name="password" placeholder="Password" required />
            <br/>
            <button type="submit">Log In</button>
      </form>
  );
}

export default LogIn