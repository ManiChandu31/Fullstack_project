import { useEffect, useState } from "react";

function ViewStudents() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    setStudents(users);
  };

  const handleRemoveStudent = (student) => {
    const studentLabel = student.userId || student.email;
    if (!confirm(`Are you sure you want to remove student: ${studentLabel}?\n\nThis will also delete:\n- All their exam attempts\n- All their assessment results\n- All admin feedback for this student\n\nThis action cannot be undone.`)) {
      return;
    }

    // Remove from users
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.filter(u => u.email !== student.email && u.userId !== student.userId);
    localStorage.setItem("users", JSON.stringify(users));

    // Remove all attempts by this student
    let attempts = JSON.parse(localStorage.getItem("attempts")) || [];
    attempts = attempts.filter(a => a.user !== student.email && a.user !== student.userId);
    localStorage.setItem("attempts", JSON.stringify(attempts));

    // Remove admin feedback for this student
    let feedbacks = JSON.parse(localStorage.getItem("adminFeedback")) || [];
    feedbacks = feedbacks.filter(f => f.studentEmail !== student.email && f.studentEmail !== student.userId);
    localStorage.setItem("adminFeedback", JSON.stringify(feedbacks));

    alert(`Student ${studentLabel} has been successfully removed from the system.`);
    loadStudents(); // Reload the list
  };

  const filteredStudents = students.filter(student =>
    (student.userId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentStats = (student) => {
    const attempts = JSON.parse(localStorage.getItem("attempts")) || [];
    const studentAttempts = attempts.filter(a => a.user === student.userId || a.user === student.email);
    const uniqueTests = new Set(studentAttempts.map(a => a.testType));
    
    return {
      totalAttempts: studentAttempts.length,
      completedAssessments: uniqueTests.size
    };
  };

  return (
    <div className="page-shell">
      <div className="page-card">
        <h2 className="form-title">Registered Students Management</h2>
        
        <div className="exam-info" style={{marginBottom: '20px'}}>
          <p>📊 Total Students: <strong>{students.length}</strong></p>
          <p>Manage student registrations and remove students when needed. Removing a student will delete all their data including exam attempts and results.</p>
        </div>

        <div className="form-row" style={{marginBottom: '20px'}}>
          <input
            type="text"
            placeholder="🔍 Search students by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{width: '100%'}}
          />
        </div>

        {filteredStudents.length === 0 ? (
          <p>{searchTerm ? 'No students found matching your search.' : 'No registered students found.'}</p>
        ) : (
          <div className="table-wrap">
            <table className="clean-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Email</th>
                  <th>Registered On</th>
                  <th>Assessments</th>
                  <th>Total Attempts</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => {
                  const stats = getStudentStats(student);
                  return (
                    <tr key={index}>
                      <td>{student.userId || "-"}</td>
                      <td>{student.email}</td>
                      <td>{new Date(student.createdAt).toLocaleString()}</td>
                      <td>{stats.completedAssessments}</td>
                      <td>{stats.totalAttempts}</td>
                      <td>
                        <button
                          onClick={() => handleRemoveStudent(student)}
                          className="cp-secondary-btn"
                          style={{
                            padding: '8px 16px',
                            fontSize: '14px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none'
                          }}
                          type="button"
                        >
                          🗑️ Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewStudents;
