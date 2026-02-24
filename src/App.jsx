import { Link, Routes, Route, useLocation } from "react-router-dom";

// Auth pages
import SignIn from "./SignIn";
import SignUp from "./SignUp";

// Admin pages
import AdminDashboard from "./admin/AdminDashboard";
import ManageTests from "./admin/ManageTests";
import CareerRecommendations from "./admin/CareerRecommendations";
import ScheduleExam from "./admin/ScheduleExam";

// User pages
import UserDashboard from "./user/UserDashboard";
import MyResults from "./user/MyResults";
import ScheduledExams from "./user/ScheduledExams";

// Assessment pages
import CareerAssessment from "./assessments/CareerAssessment";
import PersonalityTest from "./assessments/PersonalityTest";
import SkillsEvaluation from "./assessments/SkillsEvaluation";
import TestResult from "./assessments/TestResult";

// Career pages
import CareerList from "./careers/CareerList";
import CareerDetails from "./careers/CareerDetails";

import ViewStudents from "./admin/ViewStudents";
import StudentResults from "./admin/StudentResults";

import StudentChat from "./chat/StudentChat";
import AdminChat from "./chat/AdminChat";


function App() {
  const location = useLocation();
  const loggedInRole = localStorage.getItem("loggedIn");

  const isAuthRoute =
    location.pathname === "/" ||
    location.pathname === "/signin" ||
    location.pathname === "/signup";

  const dashboardPath =
    loggedInRole === "admin"
      ? "/admin/dashboard"
      : loggedInRole === "user"
      ? "/user/dashboard"
      : "/signin";

  const isDashboardPage =
    location.pathname === "/admin/dashboard" ||
    location.pathname === "/user/dashboard";

  return (
    <div className="app">
      {!isAuthRoute && (
        <header className="topbar">
          <div className="brand">CareerPath</div>
          <nav className="topbar-links">
            {loggedInRole ? (
              !isDashboardPage && <Link to={dashboardPath}>Back to Dashboard</Link>
            ) : (
              <>
                <Link to="/signin">Login</Link>
                <Link to="/signup">Register</Link>
              </>
            )}
          </nav>
        </header>
      )}

      <Routes>

        {/* AUTH SCREENS (inside card layout) */}
        <Route
          path="/"
          element={
            <div className="auth-shell cp-gradient-bg">
              <section className="auth-left">
                <h1>Welcome to CareerPath</h1>
                <p>
                  AI-powered career guidance that analyzes your personality,
                  skills, and interests.
                </p>
              </section>
              <section className="auth-right">
                <div className="card auth-card">
                  <SignIn />
                </div>
              </section>
            </div>
          }
        />

        <Route
          path="/signin"
          element={
            <div className="auth-shell cp-gradient-bg">
              <section className="auth-left">
                <h1>Welcome to CareerPath</h1>
                <p>
                  AI-powered career guidance that analyzes your personality,
                  skills, and interests.
                </p>
              </section>
              <section className="auth-right">
                <div className="card auth-card">
                  <SignIn />
                </div>
              </section>
            </div>
          }
        />

        <Route
          path="/signup"
          element={
            <div className="auth-shell cp-gradient-bg">
              <section className="auth-left">
                <h1>Create your CareerPath account</h1>
                <p>
                  Join now and start your personalized assessment journey.
                </p>
              </section>
              <section className="auth-right">
                <div className="card auth-card">
                  <SignUp />
                </div>
              </section>
            </div>
          }
        />

        <Route path="/student/chat" element={<StudentChat />} />
        <Route path="/admin/chat" element={<AdminChat />} />


        {/* ADMIN ROUTES */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-tests" element={<ManageTests />} />
        <Route path="/admin/schedule-exam" element={<ScheduleExam />} />
        <Route path="/admin/recommendations" element={<CareerRecommendations />} />

<Route path="/admin/students" element={<ViewStudents />} />
<Route path="/admin/student-results" element={<StudentResults />} />


        {/* USER ROUTES */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/results" element={<MyResults />} />
        <Route path="/user/scheduled-exams" element={<ScheduledExams />} />

        {/* ASSESSMENT ROUTES */}
        <Route path="/career-assessment" element={<CareerAssessment />} />
        <Route path="/personality-test" element={<PersonalityTest />} />
        <Route path="/skills-evaluation" element={<SkillsEvaluation />} />
        <Route path="/test-result" element={<TestResult />} />

        {/* CAREER ROUTES */}
      {/* CAREER ROUTES */}
<Route path="/careers" element={<CareerList />} />
<Route path="/career-details/:id" element={<CareerDetails />} />

      </Routes>
    </div>
  );
}

export default App;
