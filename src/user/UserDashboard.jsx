import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function UserDashboard() {
  const navigate = useNavigate();
  const [assessmentStats, setAssessmentStats] = useState({
    completedCount: 0,
    hasCompletedAny: false
  });

  useEffect(() => {
    const loggedUser = localStorage.getItem("loggedInUser");
    const loggedUserEmail = localStorage.getItem("loggedInUserEmail");
    const attempts = JSON.parse(localStorage.getItem("attempts")) || [];
    const myAttempts = attempts.filter(a => a.user === loggedUser || a.user === loggedUserEmail);
    
    const uniqueTests = new Set(myAttempts.map(a => a.testType));
    
    setAssessmentStats({
      completedCount: uniqueTests.size,
      hasCompletedAny: myAttempts.length > 0
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInUserEmail");
    localStorage.removeItem("loggedInUserName");
    alert("Logged out successfully!");
    navigate("/signin");
  };

  return (
    <div className="cp-page cp-gradient-bg">
      <div className="cp-container">
        <div className="cp-glass cp-dashboard-head">
          <div>
            <h2 className="cp-dashboard-title">Welcome, Student!</h2>
            <p className="cp-dashboard-subtitle">
              Ready to discover your perfect career path? Choose an action below.
            </p>
          </div>
          <button className="cp-secondary-btn" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="cp-action-grid">
          <div className="cp-glass cp-action-card">
            <div className="cp-action-icon">�</div>
            <h3>Scheduled Exams</h3>
            <p>View upcoming scheduled assessments and take active exams.</p>
            <button className="cp-primary-btn" type="button" onClick={() => navigate("/user/scheduled-exams")}>
              View Schedules
            </button>
          </div>

          {!assessmentStats.hasCompletedAny && (
            <div className="cp-glass cp-action-card">
              <div className="cp-action-icon">📝</div>
              <h3>Take Assessment</h3>
              <p>Start your career assessment and get personalized recommendations.</p>
              <button className="cp-primary-btn" type="button" onClick={() => navigate("/user/scheduled-exams")}>
                View Available Exams
              </button>
            </div>
          )}

          <div className="cp-glass cp-action-card">
            <div className="cp-action-icon">📊</div>
            <h3>View My Results</h3>
            <p>See your profile, top skills, and recommended career options.</p>
            <button className="cp-primary-btn" type="button" onClick={() => navigate("/user/results")}>
              View Results
            </button>
          </div>

          <div className="cp-glass cp-action-card">
            <div className="cp-action-icon">💡</div>
            <h3>Explore Careers</h3>
            <p>Browse detailed career information and future opportunities.</p>
            <button className="cp-primary-btn" type="button" onClick={() => navigate("/careers")}>
              Explore Now
            </button>
          </div>
        </div>

        <div className="cp-stats-grid">
          <div className="cp-glass cp-stat-card">
            <span className="cp-stat-value">{assessmentStats.completedCount}</span>
            <span className="cp-stat-label">Assessments Completed</span>
          </div>
          <div className="cp-glass cp-stat-card">
            <span className="cp-stat-value">0</span>
            <span className="cp-stat-label">Career Matches</span>
          </div>
          <div className="cp-glass cp-stat-card">
            <button className="cp-secondary-btn" type="button" onClick={() => navigate("/student/chat")}>
              Chat with Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
