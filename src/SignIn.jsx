import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [studentLoginType, setStudentLoginType] = useState("userid");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const getStoredUsers = () => {
    try {
      const storedUsers = localStorage.getItem("users");
      const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [];
      return Array.isArray(parsedUsers) ? parsedUsers : [];
    } catch {
      return [];
    }
  };

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

    const users = getStoredUsers();

    const foundUser = users.find((u) => {
      const isIdentifierMatch =
        studentLoginType === "email"
          ? u.email === normalizedEmail
          : u.userId === normalizedIdentifier;

      return isIdentifierMatch && u.password === normalizedPassword;
    });

    if (foundUser) {
      alert("User Login Successful!");
      localStorage.setItem("loggedIn", "user");
      localStorage.setItem("loggedInUser", foundUser.userId || foundUser.email);
      localStorage.setItem("loggedInUserId", foundUser.userId || "");
      localStorage.setItem("loggedInUserEmail", foundUser.email);
      localStorage.setItem("loggedInUserName", foundUser.userId || foundUser.email);
      navigate("/user/dashboard");
      return;
    }

    alert(
      studentLoginType === "email"
        ? "Incorrect email or password"
        : "Incorrect user ID or password"
    );
  };

  return (
    <div>
      <h2 className="form-title">Welcome Back</h2>
      <p className="form-subtitle">Select your role to continue</p>

      <div className="role-switch" role="tablist" aria-label="Select role">
        <button
          type="button"
          className={`role-tile ${role === "student" ? "active" : ""}`}
          onClick={() => {
            setRole("student");
            setStudentLoginType("userid");
          }}
        >
          <span className="role-icon" aria-hidden="true">🎓</span>
          <strong>Student</strong>
          <small>Take assessments & view results</small>
        </button>

        <button
          type="button"
          className={`role-tile ${role === "faculty" ? "active" : ""}`}
          onClick={() => {
            setRole("faculty");
            setStudentLoginType("email");
          }}
        >
          <span className="role-icon" aria-hidden="true">🧑‍🏫</span>
          <strong>Faculty</strong>
          <small>Create & manage assessments</small>
        </button>
      </div>

      {role === "student" && (
        <div className="login-type-switch" role="tablist" aria-label="Student login type">
          <button
            type="button"
            className={`login-type-btn ${studentLoginType === "userid" ? "active" : ""}`}
            onClick={() => setStudentLoginType("userid")}
          >
            User ID
          </button>
          <button
            type="button"
            className={`login-type-btn ${studentLoginType === "email" ? "active" : ""}`}
            onClick={() => setStudentLoginType("email")}
          >
            Email
          </button>
        </div>
      )}

      <div className="form-row">
        <input
          type="text"
          placeholder={
            role === "faculty"
              ? "Faculty Email"
              : studentLoginType === "email"
              ? "Enter Email"
              : "Enter User ID"
          }
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
