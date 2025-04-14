import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import "../Styles/AuthPage.css";

function SignUp() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const userId = crypto.randomUUID();

    try {
      const response = await fetch("http://localhost:5000/api/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Sign-up successful!");
        navigate("/login");
      } else {
        alert(data.message || "Error signing up");
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  function isVisible() {
    const pwd = document.getElementById("password");
    pwd.type = pwd.type === "password" ? "text" : "password";
  }

  async function isTaken() {
    const input = document.getElementById("username").value;

    try {
      const response = await fetch(`http://localhost:5000/api/check-username?username=${input}`);
      const data = await response.json();

      if (response.ok && data.isTaken) {
        alert("Username is already taken!");
        document.getElementById("username").value = ""
      }
    } catch (error) {
      console.error("Error checking username:", error);
    }
  }

  return (
    <PageWrapper>
      <div className="auth-half-left">
        <div className="auth-overlay">
          <h1>Join FitFriends 💜</h1>
          <p>Create your account and start your fitness journey today.<br />Let’s go stronger together!</p>
        </div>
      </div>
      <div className="auth-half-right">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Sign Up</h2>
          <p>Enter your details</p>
          <input id="username" type="text" name="username" placeholder="Username" onInput={isTaken} required />
          <input type="email" name="email" placeholder="Email" required />
          <input id="password" type="password" name="password" minLength={8} placeholder="Password" required />
          <div className="checkbox-wrapper-inline">
            <input type="checkbox" onClick={isVisible} />
            <label>Show Password</label>
          </div>
          <button type="submit">Sign Up</button>
          <p className="footer-link">
            Has an account? <a href="/login">Log In</a>
          </p>
        </form>
      </div>
    </PageWrapper>
  );
}

export default SignUp;
