import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    const normalizedUserId = userId.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedUserId || !normalizedEmail || !normalizedPassword) {
      alert("Please enter user ID, email and password");
      return;
    }

    if (normalizedEmail === "admin@example.com") {
      alert("This email is reserved for admin login");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const userIdExists = users.some((u) => u.userId === normalizedUserId);
    if (userIdExists) {
      alert("User ID already exists!");
      return;
    }

    const exists = users.some((u) => u.email === normalizedEmail);
    if (exists) {
      alert("User already exists!");
      return;
    }

    const newUser = {
      userId: normalizedUserId,
      email: normalizedEmail,
      password: normalizedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful!");
    navigate("/signin");
  };

  return (
    <div>
      <h2 className="form-title">Sign Up</h2>

      <div className="form-row">
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>

      <div className="form-row">
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-row">
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="form-row">
        <button className="button" onClick={handleSignup}>
          Register
        </button>
      </div>

      <div className="helper">
        Already have an account?{" "}
        <span className="link" onClick={() => navigate("/signin")}>Sign In</span>
      </div>
    </div>
  );
}

export default SignUp;
