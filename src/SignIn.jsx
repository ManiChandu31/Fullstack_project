import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const normalizedIdentifier = identifier.trim();
    const normalizedEmail = normalizedIdentifier.toLowerCase();
    const normalizedPassword = password.trim();
    const adminEmail = "admin@example.com";
    const adminPassword = "Admin123";

    if (role === "faculty") {
      if (normalizedEmail === adminEmail && normalizedPassword === adminPassword) {
        alert("Admin Login Successful!");
        localStorage.setItem("loggedIn", "admin");
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("loggedInUserEmail");
        localStorage.removeItem("loggedInUserName");
        navigate("/admin/dashboard");
        return;
      }

      alert("Incorrect faculty credentials");
      return;
    }

    if (normalizedEmail === adminEmail) {
      alert("For admin account, select Faculty role and login");
      return;
    }

    // STUDENT LOGIN
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
      (u) =>
        (u.email === normalizedEmail || u.userId === normalizedIdentifier) &&
        u.password === normalizedPassword
    );

    if (foundUser) {
      alert("User Login Successful!");
      localStorage.setItem("loggedIn", "user");
      localStorage.setItem("loggedInUser", foundUser.userId || foundUser.email);
      localStorage.setItem("loggedInUserEmail", foundUser.email);
      localStorage.setItem("loggedInUserName", foundUser.userId || foundUser.email);
      navigate("/user/dashboard");
      return;
    }

    alert("Incorrect email or password");
  };

  return (
    <div>
      <h2 className="form-title">Welcome Back</h2>
      <p className="form-subtitle">Select your role to continue</p>

      <div className="role-switch" role="tablist" aria-label="Select role">
        <button
          type="button"
          className={`role-tile ${role === "student" ? "active" : ""}`}
          onClick={() => setRole("student")}
        >
          <span className="role-icon" aria-hidden="true">🎓</span>
          <strong>Student</strong>
          <small>Take assessments & view results</small>
        </button>

        <button
          type="button"
          className={`role-tile ${role === "faculty" ? "active" : ""}`}
          onClick={() => setRole("faculty")}
        >
          <span className="role-icon" aria-hidden="true">🧑‍🏫</span>
          <strong>Faculty</strong>
          <small>Create & manage assessments</small>
        </button>
      </div>

      <div className="form-row">
        <input
          type="text"
          placeholder="User ID or Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
      </div>

      <div className="form-row">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="form-row">
        <button className="button" onClick={handleLogin}>
          {`Login as ${role.toUpperCase()}`}
        </button>
      </div>

      <div className="helper">
        Don't have an account?{" "}
        <span className="link" onClick={() => navigate("/signup")}>Sign Up</span>
      </div>

      <div className="credentials-box">
        <p className="credentials-title">Login Credentials</p>
        <p className="credentials-item">
          Faculty: admin@example.com / Admin123
        </p>
        <p className="credentials-item">
          Student: Use your User ID or Email with password
        </p>
      </div>
    </div>
  );
}

export default SignIn;
