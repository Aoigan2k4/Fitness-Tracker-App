class User {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    addUser() {
        return {
          username: this.username,
          email: this.email,
          password: this.password
        };
    }

    static getUser(snapshot) {
        const user = snapshot.data();
        return new User(user.username, user.email, user.password);
    }
}

export default User;