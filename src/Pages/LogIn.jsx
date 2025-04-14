import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import "../Styles/AuthPage.css";

function LogIn() {
  const navigate = useNavigate();

  const handleLogIn = async (e) => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    const password = e.target.password.value;

    try {
      const response = await fetch(`http://localhost:5000/api/user-data?username=${encodeURIComponent(username)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.password !== password) {
          alert("Password does not match!");
        } else {
          sessionStorage.setItem("username", username);
          navigate("/info");
        }
      } else {
        alert(data.message || "Error logging in");
      }
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  function isVisible() {
    const x = document.getElementById("password");
    x.type = x.type === "password" ? "text" : "password";
  }

  return (
    <PageWrapper>
      <div className="auth-half-left">
        <div className="auth-overlay">
          <h1>Welcome Back 💜</h1>
          <p>Log in to access your workouts, goals, and progress.<br />Let’s keep going together!</p>
        </div>
      </div>
      <div className="auth-half-right">
        <form onSubmit={handleLogIn} className="auth-form">
          <h2>Log In</h2>
          <p>Enter your credentials</p>
          <input type="text" name="username" placeholder="Username" required />
          <input id="password" type="password" name="password" placeholder="Password" required />
          <div className="checkbox-wrapper-inline">
            <input type="checkbox" onClick={isVisible} />
            <label>Show Password</label>
          </div>
          <button type="submit">Log In</button>
          <p className="footer-link">
            Don’t have an account? <a href="/">Sign Up</a>
          </p>
        </form>
      </div>
    </PageWrapper>
  );
}

export default LogIn;
