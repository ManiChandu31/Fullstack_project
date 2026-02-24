import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ScheduledExams() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const loggedUser = localStorage.getItem("loggedInUser");
  const loggedUserEmail = localStorage.getItem("loggedInUserEmail");

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = () => {
    const allSchedules = JSON.parse(localStorage.getItem("examSchedules")) || [];
    setSchedules(allSchedules);
  };

  const getStatus = (schedule) => {
    const now = new Date();
    const start = new Date(schedule.startDateTime);
    const end = new Date(schedule.endDateTime);

    if (now < start) return { label: "Upcoming", color: "#f59e0b", canAttempt: false };
    if (now >= start && now <= end) return { label: "Active", color: "#10b981", canAttempt: true };
    return { label: "Expired", color: "#6b7280", canAttempt: false };
  };

  const hasAttempted = (scheduleId) => {
    const attempts = JSON.parse(localStorage.getItem("attempts")) || [];
    return attempts.some(a => (a.user === loggedUser || a.user === loggedUserEmail) && a.scheduleId === scheduleId);
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

  const handleStartExam = (schedule) => {
    const status = getStatus(schedule);
    
    if (!status.canAttempt) {
      alert("This exam is not currently available");
      return;
    }

    if (hasAttempted(schedule.id)) {
      alert("You have already attempted this exam");
      return;
    }

    // Validate that questions have been published for this exam type
    const questionStorageMap = {
      "Career Assessment": "careerQuestions",
      "Personality Test": "personalityQuestions",
      "Skills Evaluation": "skillQuestions"
    };

    const storageKey = questionStorageMap[schedule.examType];
    const publishedQuestions = JSON.parse(localStorage.getItem(storageKey)) || [];

    if (publishedQuestions.length === 0) {
      alert(`No questions have been published for this exam yet. The teacher needs to add questions in Manage Tests before you can attempt this exam.`);
      return;
    }

    // Store schedule info for the exam session
    localStorage.setItem("currentExamSchedule", JSON.stringify(schedule));
    
    // Navigate to appropriate exam
    switch(schedule.examType) {
      case "Career Assessment":
        navigate("/career-assessment");
        break;
      case "Personality Test":
        navigate("/personality-test");
        break;
      case "Skills Evaluation":
        navigate("/skills-evaluation");
        break;
      default:
        alert("Unknown exam type");
    }
  };

  const formatTimeRemaining = (schedule) => {
    const now = new Date();
    const end = new Date(schedule.endDateTime);
    const diff = end - now;

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''} remaining`;
    }
    
    return hours > 0 ? `${hours}h ${minutes}m remaining` : `${minutes}m remaining`;
  };

  const formatStartsIn = (schedule) => {
    const now = new Date();
    const start = new Date(schedule.startDateTime);
    const diff = start - now;

    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `Starts in ${days} day${days > 1 ? 's' : ''}`;
    }
    
    return hours > 0 ? `Starts in ${hours}h ${minutes}m` : `Starts in ${minutes}m`;
  };

  const upcomingExams = schedules.filter(s => getStatus(s).label === "Upcoming");
  const activeExams = schedules.filter(s => getStatus(s).label === "Active");
  return (
    <div className="page-shell">
      <div className="page-card">
        <h2 className="form-title">Scheduled Career Assessments</h2>

        {schedules.length === 0 ? (
          <div className="empty-state">
            <p>No scheduled exams available at the moment.</p>
            <p className="empty-subtitle">Check back later for upcoming assessments.</p>
          </div>
        ) : (
          <>
            {activeExams.length > 0 && (
              <section className="exams-section">
                <h3 className="section-title">🟢 Active Exams - Attempt Now!</h3>
                <div className="exams-grid">
                  {activeExams.map((schedule) => {
                    const attempted = hasAttempted(schedule.id);
                    const questionCount = getQuestionCount(schedule.examType);
                    
                    return (
                      <div key={schedule.id} className="exam-card active-exam">
                        <div className="exam-header">
                          <h4>{schedule.examType}</h4>
                          <span className="exam-status active">Active Now</span>
                        </div>

                        <div className="exam-details">
                          <div className="detail-item">
                            <span className="icon">📝</span>
                            <span>
                              Questions: <strong>{questionCount}</strong>
                              {questionCount === 0 && <span style={{color: '#ef4444'}}> (Not Published)</span>}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="icon">⏱️</span>
                            <span>Duration: {schedule.duration} minutes</span>
                          </div>
                          <div className="detail-item">
                            <span className="icon">⏳</span>
                            <span className="time-remaining">{formatTimeRemaining(schedule)}</span>
                          </div>
                          <div className="detail-item">
                            <span className="icon">📅</span>
                            <span>Ends: {new Date(schedule.endDateTime).toLocaleString()}</span>
                          </div>
                        </div>

                        {schedule.instructions && (
                          <div className="exam-instructions">
                            <strong>Instructions:</strong>
                            <p>{schedule.instructions}</p>
                          </div>
                        )}

                        {attempted ? (
                          <div className="exam-completed">
                            <span className="completed-badge">✓ Completed</span>
                            <p>You already completed this exam. Check <strong>My Results</strong>.</p>
                          </div>
                        ) : (
                          <button 
                            className="button exam-start-btn"
                            onClick={() => handleStartExam(schedule)}
                          >
                            Start Exam Now
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {upcomingExams.length > 0 && (
              <section className="exams-section">
                <h3 className="section-title">🟡 Upcoming Exams</h3>
                <div className="exams-grid">
                  {upcomingExams.map((schedule) => {
                    const questionCount = getQuestionCount(schedule.examType);
                    
                    return (
                      <div key={schedule.id} className="exam-card upcoming-exam">
                        <div className="exam-header">
                          <h4>{schedule.examType}</h4>
                          <span className="exam-status upcoming">{formatStartsIn(schedule)}</span>
                        </div>

                        <div className="exam-details">
                          <div className="detail-item">
                            <span className="icon">📝</span>
                            <span>
                              Questions: <strong>{questionCount}</strong>
                              {questionCount === 0 && <span style={{color: '#f59e0b'}}> (Not Published Yet)</span>}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="icon">📅</span>
                            <span>Starts: {new Date(schedule.startDateTime).toLocaleString()}</span>
                          </div>
                          <div className="detail-item">
                            <span className="icon">⏱️</span>
                            <span>Duration: {schedule.duration} minutes</span>
                          </div>
                          <div className="detail-item">
                            <span className="icon">🏁</span>
                            <span>Ends: {new Date(schedule.endDateTime).toLocaleString()}</span>
                          </div>
                        </div>

                        {schedule.instructions && (
                          <div className="exam-instructions">
                            <strong>Instructions:</strong>
                            <p>{schedule.instructions}</p>
                          </div>
                        )}

                        <div className="exam-locked">
                          <span>🔒 Exam will be available at the scheduled time</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

          </>
        )}
      </div>
    </div>
  );
}

export default ScheduledExams;
