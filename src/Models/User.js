import { db } from "../firebase"
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

class User {
    #weight;
    #height;
    #weightGoal;
    #duration;

    constructor(userID, username, email, password) {
        this.userID = userID
        this.username = username;
        this.email = email;
        this.password = password;
    }

    addUser() {
        return {
          userID: this.userID,
          username: this.username,
          email: this.email,
          password: this.password
        };
    }

    static async getUserByName(username) {
        const qry = query(collection(db, "Users"), where("username", "==", username));
        const querySnapshot = await getDocs(qry); 
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0]; 
          const user = doc.data();
          return new User(user.userID ,user.username, user.email, user.password);
        } 
        else {
          return null;
        }
    }

    static async getUserData(username){
      const user = await User.getUserByName(username);
      const userRef = doc(db, "Users", user.userID);
      const dataSnap = await getDoc(userRef)
      const info = dataSnap.data()
      return info
    }
}

export default User;