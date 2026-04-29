import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "./lib/api";

function SignUp() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [devOtp, setDevOtp] = useState("");

  const handleRequestOtp = () => {
    const normalizedUserId = userId.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhoneNumber = phoneNumber.trim();
    const normalizedPassword = password.trim();

    if (!normalizedUserId || !normalizedEmail || !normalizedPhoneNumber || !normalizedPassword) {
      alert("Please enter user ID, email, phone number and password first");
      return;
    }

    fetch(apiUrl('/api/auth/signup/request-otp'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: normalizedUserId,
        email: normalizedEmail,
        phoneNumber: normalizedPhoneNumber,
        password: normalizedPassword
      })
    }).then(async (res) => {
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setOtpRequested(true);
        setDevOtp(body.verificationCode || "");
        alert(body.deliveryMode === "SMS"
          ? "OTP sent to your phone number. Enter it below to complete registration."
          : `OTP generated in development mode: ${body.verificationCode}`);
      } else {
        alert(body.message || body.error || 'Could not request OTP');
      }
    }).catch((e) => {
      alert('Could not reach server: ' + e.message);
    });
  };

  const handleVerifyAndSignup = () => {
    const normalizedPhoneNumber = phoneNumber.trim();
    const normalizedOtp = otp.trim();

    if (!otpRequested) {
      alert("Request an OTP first");
      return;
    }

    if (!normalizedPhoneNumber || !normalizedOtp) {
      alert("Enter the OTP sent to your phone number");
      return;
    }

    fetch(apiUrl('/api/auth/signup/verify-otp'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: normalizedPhoneNumber, otp: normalizedOtp })
    }).then(async (res) => {
      if (res.ok) {
        alert('Phone number verified and registration successful!');
        navigate('/signin');
      } else {
        const err = await res.json().catch(() => ({}));
        const msg = err.message || err.error || 'OTP verification failed';
        alert(msg);
      }
    }).catch((e) => {
      alert('Could not reach server: ' + e.message);
    });
  };

  return (
    <div>
      <h2 className="form-title">Sign Up</h2>
      <p className="form-subtitle">Step 1: request an OTP. Step 2: verify it to create your account.</p>

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
          type="tel"
          placeholder="Enter Phone Number for OTP"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
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
        <button className="button" onClick={handleRequestOtp}>
          Send OTP
        </button>
      </div>

      {otpRequested && (
        <>
          <div className="form-row">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <div className="form-row">
            <button className="button" onClick={handleVerifyAndSignup}>
              Verify & Register
            </button>
          </div>
        </>
      )}

      {devOtp && (
        <div className="credentials-box">
          <p className="credentials-title">Development OTP</p>
          <p className="credentials-item">{devOtp}</p>
        </div>
      )}

      <div className="helper">
        Already have an account?{" "}
        <span className="link" onClick={() => navigate("/signin")}>Sign In</span>
      </div>
    </div>
  );
}

export default SignUp;
