import { NavLink, useNavigate } from "react-router-dom";

function StudentMenuBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("loggedInUserEmail");
    localStorage.removeItem("loggedInUserName");
    navigate("/signin");
  };

  return (
    <nav className="module-menu student-menu" aria-label="Student navigation">
      <div className="module-menu-links">
        <NavLink to="/user/dashboard">Dashboard</NavLink>
        <NavLink to="/user/scheduled-exams">Scheduled Exams</NavLink>
        <NavLink to="/user/results">My Results</NavLink>
        <NavLink to="/test-result">Assessment Results</NavLink>
        <NavLink to="/careers">Careers</NavLink>
        <NavLink to="/student/chat">Chat</NavLink>
      </div>
      <button className="module-menu-logout" type="button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default StudentMenuBar;
