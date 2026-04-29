import { NavLink, useNavigate } from "react-router-dom";

function AdminMenuBar() {
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
    <nav className="module-menu admin-menu" aria-label="Admin navigation">
      <div className="module-menu-links">
        <NavLink to="/admin/dashboard">Dashboard</NavLink>
        <NavLink to="/admin/schedule-exam">Schedule Exam</NavLink>
        <NavLink to="/admin/manage-tests">Manage Tests</NavLink>
        <NavLink to="/admin/students">Students</NavLink>
        <NavLink to="/admin/student-results">Results</NavLink>
        <NavLink to="/admin/recommendations">Recommendations</NavLink>
        <NavLink to="/admin/chat">Chat</NavLink>
      </div>
      <button className="module-menu-logout" type="button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default AdminMenuBar;
