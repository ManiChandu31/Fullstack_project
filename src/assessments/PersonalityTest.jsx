import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function PersonalityTest() {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [examSchedule, setExamSchedule] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  const [answers, setAnswers] = useState([]);

  const categoryMap = [
    "teamwork", "creativity", "communication", "social", "emotional",
    "empathy", "adaptability", "openness", "organization", "curiosity"
  ];

  useEffect(() => {
    // Check if this is a scheduled exam - REQUIRED
    const scheduleData = localStorage.getItem("currentExamSchedule");
    if (!scheduleData) {
      alert("Access Denied: This exam can only be accessed through scheduled exams.");
      navigate("/user/scheduled-exams");
      return;
    }

    const schedule = JSON.parse(scheduleData);
    if (schedule.examType !== "Personality Test") {
      alert("Invalid exam type for this assessment.");
      navigate("/user/scheduled-exams");
      return;
    }

    // Check if user has already completed this assessment
    const loggedUser = localStorage.getItem("loggedInUser");
    const loggedUserEmail = localStorage.getItem("loggedInUserEmail");
    const attempts = JSON.parse(localStorage.getItem("attempts")) || [];
    const hasCompleted = attempts.some(a => 
      (a.user === loggedUser || a.user === loggedUserEmail) && 
      a.testType === "Personality Test" && 
      a.scheduleId === schedule.id
    );

    if (hasCompleted) {
      alert("You have already completed this assessment. View your results in 'View My Results' section.");
      localStorage.removeItem("currentExamSchedule");
      navigate("/user/results");
      return;
    }

    // Load published questions from localStorage
    const publishedQuestions = JSON.parse(localStorage.getItem("personalityQuestions")) || [];
    
    if (publishedQuestions.length === 0) {
      alert("No questions available for this exam. Please contact the administrator.");
      localStorage.removeItem("currentExamSchedule");
      navigate("/user/scheduled-exams");
      return;
    }

    // Convert stored question format to assessment format
    const formattedQuestions = publishedQuestions.map((item, index) => ({
      q: item.question,
      weight: 2,
      category: categoryMap[index % categoryMap.length]
    }));

    setQuestions(formattedQuestions);
    setAnswers(Array(formattedQuestions.length).fill(""));
    setExamSchedule(schedule);
    setTimeRemaining(schedule.duration * 60);
    setLoading(false);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [timeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = (autoSubmit = false) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const hasEmptyAnswer = answers.some((answer) => answer === "");
    if (!autoSubmit && hasEmptyAnswer) {
      alert("Please answer all questions");
      return;
    }

    const score = questions.reduce((total, item, index) => {
      return total + Number(answers[index]) * item.weight;
    }, 0);

    const loggedUser = localStorage.getItem("loggedInUser");
    const loggedUserEmail = localStorage.getItem("loggedInUserEmail");
    let attempts = JSON.parse(localStorage.getItem("attempts")) || [];

    attempts.push({
      user: loggedUser,
      userId: loggedUser,
      userEmail: loggedUserEmail,
      testType: "Personality Test",
      score,
      answers,
      scheduleId: examSchedule?.id || null,
      date: new Date().toISOString()
    });

    localStorage.setItem("attempts", JSON.stringify(attempts));
    localStorage.removeItem("currentExamSchedule");
    
    if (autoSubmit) {
      alert("Time's up! Your exam has been automatically submitted.");
    } else {
      alert("Personality Test Completed!");
    }
    navigate("/user/results");
  };

  if (loading) {
    return (
      <div className="assessment-shell">
        <div className="assessment-card">
          <div className="loading-state">
            <p>Loading exam questions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="assessment-shell">
      <div className="assessment-card">
        {timeRemaining !== null && (
          <div className="exam-timer">
            <span className="timer-label">Time Remaining:</span>
            <span className={`timer-value ${timeRemaining <= 60 ? 'timer-warning' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}
        
        <h2 className="form-title">Personality Test</h2>
        <p className="exam-info">Published Questions: {questions.length} | Total Points: {questions.length * 2 * 5}</p>

        {examSchedule?.instructions && (
          <div className="exam-instructions-box">
            <strong>Instructions:</strong>
            <p>{examSchedule.instructions}</p>
          </div>
        )}

        {questions.map((item, index) => (
          <div key={index} className="assessment-row">
            <p className="assessment-question">{index + 1}. {item.q}</p>
            <select
              className="assessment-select"
              value={answers[index]}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            >
              <option value="">Select</option>
              <option value="5">Yes</option>
              <option value="1">No</option>
            </select>
          </div>
        ))}

        <button className="button assessment-submit" onClick={handleSubmit}>
          Submit Personality Test
        </button>
      </div>
    </div>
  );
}

export default PersonalityTest;
