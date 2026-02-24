import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const adminActions = [
    {
      title: "Schedule Exam",
      description: "Create scheduled assessments with time limits for students.",
      icon: "📅",
      action: () => navigate("/admin/schedule-exam"),
    },
    {
      title: "Manage Tests",
      description: "Create, edit and publish question sets for assessments.",
      icon: "🧪",
      action: () => navigate("/admin/manage-tests"),
    },
    {
      title: "View Registered Students",
      description: "Manage student accounts and remove registrations.",
      icon: "👩‍🎓",
      action: () => navigate("/admin/students"),
    },
    {
      title: "View Student Results",
      description: "Review assessment results and provide feedback.",
      icon: "📊",
      action: () => navigate("/admin/student-results"),
    },
    {
      title: "Edit Questions",
      description: "Update assessment question bank and content.",
      icon: "✍️",
      action: () => navigate("/admin/edit-questions"),
    },
    {
      title: "Career Recommendations",
      description: "Manage recommendation rules and career data.",
      icon: "🎯",
      action: () => navigate("/admin/recommendations"),
    },
    {
      title: "Student Queries",
      description: "Respond to student messages and support requests.",
      icon: "💬",
      action: () => navigate("/admin/chat"),
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    alert("Logged out successfully!");
    navigate("/signin");
  };

  return (
    <div className="admin-shell">
      <div className="admin-header-card">
        <div>
          <h2 className="admin-title">Faculty Dashboard</h2>
          <p className="admin-subtitle">Manage exams, students, results, and provide career guidance.</p>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-value">7</span>
          <span className="admin-stat-label">Management Tools</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">24/7</span>
          <span className="admin-stat-label">Panel Access</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">Active</span>
          <span className="admin-stat-label">System Status</span>
        </div>
      </div>

      <div className="admin-action-grid">
        {adminActions.map((item) => (
          <button key={item.title} className="admin-action-card" type="button" onClick={item.action}>
            <span className="admin-action-icon" aria-hidden="true">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
