import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ScheduleExam() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    examType: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    duration: 30,
    instructions: ""
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadSchedules();
    
    // Check if coming from Manage Tests with pre-selected exam type
    const selectedType = localStorage.getItem("selectedExamType");
    if (selectedType) {
      setFormData(prev => ({ ...prev, examType: selectedType }));
      localStorage.removeItem("selectedExamType"); // Clear after using
    }
  }, []);

  const loadSchedules = () => {
    const saved = JSON.parse(localStorage.getItem("examSchedules")) || [];
    setSchedules(saved);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.examType || !formData.startDate || !formData.startTime || 
        !formData.endDate || !formData.endTime) {
      alert("Please fill in all required fields");
      return;
    }

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    if (endDateTime <= startDateTime) {
      alert("End date/time must be after start date/time");
      return;
    }

    const newSchedule = {
      id: editingId || Date.now(),
      examType: formData.examType,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      duration: parseInt(formData.duration),
      instructions: formData.instructions,
      createdBy: localStorage.getItem("loggedInUser") || "admin",
      createdAt: editingId ? schedules.find(s => s.id === editingId)?.createdAt : new Date().toISOString()
    };

    let updatedSchedules;
    if (editingId) {
      updatedSchedules = schedules.map(s => s.id === editingId ? newSchedule : s);
      setEditingId(null);
    } else {
      updatedSchedules = [...schedules, newSchedule];
    }

    localStorage.setItem("examSchedules", JSON.stringify(updatedSchedules));
    setSchedules(updatedSchedules);
    
    setFormData({
      examType: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      duration: 30,
      instructions: ""
    });

    alert(editingId ? "Exam schedule updated successfully!" : "Exam scheduled successfully!");
  };

  const handleEdit = (schedule) => {
    const startDate = new Date(schedule.startDateTime);
    const endDate = new Date(schedule.endDateTime);

    setFormData({
      examType: schedule.examType,
      startDate: startDate.toISOString().split('T')[0],
      startTime: startDate.toTimeString().slice(0, 5),
      endDate: endDate.toISOString().split('T')[0],
      endTime: endDate.toTimeString().slice(0, 5),
      duration: schedule.duration,
      instructions: schedule.instructions || ""
    });
    setEditingId(schedule.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this exam schedule?")) return;
    
    const updatedSchedules = schedules.filter(s => s.id !== id);
    localStorage.setItem("examSchedules", JSON.stringify(updatedSchedules));
    setSchedules(updatedSchedules);
    alert("Schedule deleted successfully!");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      examType: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      duration: 30,
      instructions: ""
    });
  };

  const getStatus = (schedule) => {
    const now = new Date();
    const start = new Date(schedule.startDateTime);
    const end = new Date(schedule.endDateTime);

    if (now < start) return { label: "Upcoming", color: "#f59e0b" };
    if (now >= start && now <= end) return { label: "Active", color: "#10b981" };
    return { label: "Expired", color: "#6b7280" };
  };

  const getParticipantCount = (scheduleId) => {
    const attempts = JSON.parse(localStorage.getItem("attempts")) || [];
    return attempts.filter(a => a.scheduleId === scheduleId).length;
  };

  const getQuestionCount = (examType) => {
    const questionStorageMap = {
      "Career Assessment": "careerQuestions",
      "Personality Test": "personalityQuestions",
      "Skills Evaluation": "skillQuestions"
    };

    const storageKey = questionStorageMap[examType];
    const questions = JSON.parse(localStorage.getItem(storageKey)) || [];
    return questions.length;
  };

  return (
    <div className="page-shell">
      <div className="page-card">
        <h2 className="form-title">Schedule Career Assessment Exam</h2>

        <form onSubmit={handleSubmit} className="schedule-form">
          <div className="form-row">
            <div className="form-group">
              <label>Exam Type *</label>
              <select
                className="assessment-select"
                value={formData.examType}
                onChange={(e) => setFormData({...formData, examType: e.target.value})}
                required
              >
                <option value="">Select Exam Type</option>
                <option value="Career Assessment">Career Assessment ({getQuestionCount("Career Assessment")} questions)</option>
                <option value="Personality Test">Personality Test ({getQuestionCount("Personality Test")} questions)</option>
                <option value="Skills Evaluation">Skills Evaluation ({getQuestionCount("Skills Evaluation")} questions)</option>
              </select>
              {formData.examType && getQuestionCount(formData.examType) === 0 && (
                <p style={{color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem'}}>
                  ⚠️ Warning: No questions published for this exam type. Please add questions in Manage Tests first.
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Duration (minutes) *</label>
              <input
                type="number"
                className="form-input"
                min="5"
                max="180"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Start Time *</label>
              <input
                type="time"
                className="form-input"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>End Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>End Time *</label>
              <input
                type="time"
                className="form-input"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Instructions for Students</label>
            <textarea
              className="feedback-textarea"
              rows="3"
              placeholder="Enter exam instructions, guidelines, or important notes..."
              value={formData.instructions}
              onChange={(e) => setFormData({...formData, instructions: e.target.value})}
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="button">
              {editingId ? "Update Schedule" : "Schedule Exam"}
            </button>
            {editingId && (
              <button type="button" className="button-secondary" onClick={cancelEdit}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="schedules-section">
          <h3>Scheduled Exams</h3>
          
          {schedules.length === 0 ? (
            <p className="empty-message">No exams scheduled yet.</p>
          ) : (
            <div className="schedules-grid">
              {schedules.map((schedule) => {
                const status = getStatus(schedule);
                const participantCount = getParticipantCount(schedule.id);
                const questionCount = getQuestionCount(schedule.examType);
                
                return (
                  <div key={schedule.id} className="schedule-card">
                    <div className="schedule-header">
                      <h4>{schedule.examType}</h4>
                      <span className="schedule-status" style={{ backgroundColor: status.color }}>
                        {status.label}
                      </span>
                    </div>

                    <div className="schedule-details">
                      <div className="detail-row">
                        <span className="detail-label">� Questions:</span>
                        <span>
                          {questionCount} published
                          {questionCount === 0 && <span style={{color: '#ef4444', marginLeft: '0.5rem'}}>⚠️ Not Ready</span>}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">�📅 Start:</span>
                        <span>{new Date(schedule.startDateTime).toLocaleString()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">🏁 End:</span>
                        <span>{new Date(schedule.endDateTime).toLocaleString()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">⏱️ Duration:</span>
                        <span>{schedule.duration} minutes</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">👥 Participants:</span>
                        <span>{participantCount} students</span>
                      </div>
                      {schedule.instructions && (
                        <div className="schedule-instructions">
                          <strong>Instructions:</strong>
                          <p>{schedule.instructions}</p>
                        </div>
                      )}
                    </div>

                    <div className="schedule-actions">
                      <button 
                        className="button-small" 
                        onClick={() => handleEdit(schedule)}
                        disabled={status.label === "Expired"}
                      >
                        Edit
                      </button>
                      <button 
                        className="button-small button-danger" 
                        onClick={() => handleDelete(schedule.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScheduleExam;
