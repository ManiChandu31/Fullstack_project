import { useEffect, useState } from "react";

function StudentResults() {
  const [results, setResults] = useState([]);
  const [studentDirectory, setStudentDirectory] = useState({});
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({ feedback: "", suggestions: "" });
  const [filterStudent, setFilterStudent] = useState("");

  useEffect(() => {
    const attempts = JSON.parse(localStorage.getItem("attempts")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const normalizedUsers = users.map((user) => ({
      ...user,
      userId: user.userId || user.email
    }));

    const directory = normalizedUsers.reduce((acc, user) => {
      if (user?.email) {
        acc[user.email] = user.userId;
        acc[user.userId] = user.userId;
      }
      return acc;
    }, {});

    const migratedAttempts = attempts.map((attempt) => {
      const existingKey = attempt.user || attempt.userId || attempt.userEmail;
      let resolvedUserId = existingKey ? (directory[existingKey] || existingKey) : "";

      if (!resolvedUserId && normalizedUsers.length === 1) {
        resolvedUserId = normalizedUsers[0].userId;
      }

      if (!resolvedUserId) {
        return attempt;
      }

      return {
        ...attempt,
        user: resolvedUserId,
        userId: resolvedUserId,
        userEmail: attempt.userEmail || attempt.user || ""
      };
    });

    const hasMigrationChanges = JSON.stringify(migratedAttempts) !== JSON.stringify(attempts);
    if (hasMigrationChanges) {
      localStorage.setItem("attempts", JSON.stringify(migratedAttempts));
    }

    setResults(migratedAttempts);
    setStudentDirectory(directory);
  }, []);

  const normalizeStudentKey = (studentId) =>
    studentId && String(studentId).trim() ? String(studentId) : "__unknown__";

  const getResultUserKey = (result) =>
    normalizeStudentKey(result?.user || result?.userId || result?.userEmail);

  const getStudentDisplayName = (studentId) => {
    const key = normalizeStudentKey(studentId);
    if (key === "__unknown__") return "Unknown User ID";
    return studentDirectory[key] || key;
  };

  const analyzePersonality = (result) => {
    if (!result.answers || result.testType !== "Personality Test") return null;
    
    const categories = {
      teamwork: { scores: [], label: "Teamwork & Collaboration" },
      creativity: { scores: [], label: "Creative Thinking" },
      communication: { scores: [], label: "Communication Skills" },
      social: { scores: [], label: "Social Engagement" },
      emotional: { scores: [], label: "Emotional Stability" },
      empathy: { scores: [], label: "Empathy & Understanding" },
      adaptability: { scores: [], label: "Adaptability" },
      openness: { scores: [], label: "Openness to Experience" },
      organization: { scores: [], label: "Organization & Structure" },
      curiosity: { scores: [], label: "Curiosity & Learning" }
    };

    const questions = [
      { category: "teamwork" }, { category: "creativity" }, { category: "communication" },
      { category: "social" }, { category: "emotional" }, { category: "empathy" },
      { category: "adaptability" }, { category: "openness" }, { category: "organization" },
      { category: "curiosity" }
    ];

    result.answers.forEach((answer, idx) => {
      const cat = questions[idx]?.category;
      if (cat && categories[cat]) {
        categories[cat].scores.push(Number(answer));
      }
    });

    const analysis = {};
    Object.keys(categories).forEach(key => {
      const scores = categories[key].scores;
      if (scores.length > 0) {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        analysis[key] = {
          label: categories[key].label,
          score: avg,
          percentage: (avg / 5) * 100
        };
      }
    });

    return analysis;
  };

  const analyzeSkills = (result) => {
    if (!result.answers || result.testType !== "Skills Evaluation") return null;
    
    const categories = {
      technical: { scores: [], label: "Technical Problem-Solving" },
      planning: { scores: [], label: "Planning & Organization" },
      communication: { scores: [], label: "Communication" },
      "time-management": { scores: [], label: "Time Management" },
      pressure: { scores: [], label: "Work Under Pressure" },
      learning: { scores: [], label: "Quick Learning" },
      collaboration: { scores: [], label: "Team Collaboration" },
      presentation: { scores: [], label: "Presentation Skills" },
      "problem-solving": { scores: [], label: "Creative Problem-Solving" },
      analytical: { scores: [], label: "Analytical Thinking" }
    };

    const questions = [
      { category: "technical" }, { category: "planning" }, { category: "communication" },
      { category: "time-management" }, { category: "pressure" }, { category: "learning" },
      { category: "collaboration" }, { category: "presentation" }, { category: "problem-solving" },
      { category: "analytical" }
    ];

    result.answers.forEach((answer, idx) => {
      const cat = questions[idx]?.category;
      if (cat && categories[cat]) {
        categories[cat].scores.push(Number(answer));
      }
    });

    const analysis = {};
    Object.keys(categories).forEach(key => {
      const scores = categories[key].scores;
      if (scores.length > 0) {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        analysis[key] = {
          label: categories[key].label,
          score: avg,
          percentage: (avg / 5) * 100
        };
      }
    });

    return analysis;
  };

  const analyzeInterests = (result) => {
    if (!result.answers || result.testType !== "Career Assessment") return null;
    
    const interests = {
      technology: { scores: [], label: "Technology & Computing" },
      analytical: { scores: [], label: "Analytical & Logical Work" },
      detail: { scores: [], label: "Detail-Oriented Tasks" },
      independent: { scores: [], label: "Independent Work" }
    };

    const mapping = [
      ["technology", "analytical"], ["technology"], ["analytical"], ["technology"],
      [], ["detail"], ["detail"], ["independent"], ["analytical"], ["independent"]
    ];

    result.answers.forEach((answer, idx) => {
      const cats = mapping[idx] || [];
      cats.forEach(cat => {
        if (interests[cat]) {
          interests[cat].scores.push(Number(answer));
        }
      });
    });

    const analysis = {};
    Object.keys(interests).forEach(key => {
      const scores = interests[key].scores;
      if (scores.length > 0) {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        analysis[key] = {
          label: interests[key].label,
          score: avg,
          percentage: (avg / 5) * 100
        };
      }
    });

    return analysis;
  };

  const handleViewDetails = (result, index) => {
    setSelectedResult(result);
    setSelectedIndex(index);
    const existingFeedback = getFeedback(index);
    if (existingFeedback) {
      setFeedbackForm({
        feedback: existingFeedback.feedback,
        suggestions: existingFeedback.suggestions
      });
    } else {
      setFeedbackForm({ feedback: "", suggestions: "" });
    }
  };

  const handleSubmitFeedback = () => {
    if (!feedbackForm.feedback.trim() || !feedbackForm.suggestions.trim()) {
      alert("Please provide both feedback and suggestions");
      return;
    }

    const allFeedback = JSON.parse(localStorage.getItem("adminFeedback")) || [];
    const existingIndex = allFeedback.findIndex(f => f.resultId === selectedIndex);

    const newFeedback = {
      resultId: selectedIndex,
      studentEmail: selectedResult.user,
      testType: selectedResult.testType,
      feedback: feedbackForm.feedback,
      suggestions: feedbackForm.suggestions,
      date: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      allFeedback[existingIndex] = newFeedback;
    } else {
      allFeedback.push(newFeedback);
    }

    localStorage.setItem("adminFeedback", JSON.stringify(allFeedback));
    alert("Feedback submitted successfully!");
    setFeedbackForm({ feedback: "", suggestions: "" });
  };

  const getFeedback = (resultId) => {
    const feedback = JSON.parse(localStorage.getItem("adminFeedback")) || [];
    return feedback.find(f => f.resultId === resultId);
  };

  const getStudentStats = (studentKey) => {
    const studentResults = results.filter(r => getResultUserKey(r) === studentKey);
    if (studentResults.length === 0) return null;

    const avgScore = studentResults.reduce((sum, r) => sum + r.score, 0) / studentResults.length;
    const completedTests = studentResults.length;
    const latestTest = studentResults[studentResults.length - 1];

    return { avgScore, completedTests, latestTest };
  };

  const uniqueStudents = [...new Set(results.map(r => getResultUserKey(r)))];
  const filteredResults = filterStudent 
    ? results.filter(r => getResultUserKey(r) === filterStudent)
    : results;

  return (
    <div className="page-shell">
      <div className="page-card">
        <h2 className="form-title">Student Assessment Review</h2>

        {results.length === 0 ? (
          <p style={{textAlign: 'center', padding: '2rem'}}>No student test attempts found.</p>
        ) : selectedResult ? (
          <div className="result-detail">
            <button className="button" onClick={() => { setSelectedResult(null); setSelectedIndex(null); }} style={{marginBottom: '1rem'}}>
              ← Back to All Students
            </button>

            <div className="result-header">
              <h3>{getStudentDisplayName(getResultUserKey(selectedResult))} - {selectedResult.testType}</h3>
              <div className="result-score">
                <span className="score-label">Score:</span>
                <span className="score-value">{selectedResult.score}</span>
                <span className="score-percentage">({Math.round((selectedResult.score / 100) * 100)}%)</span>
              </div>
              <p className="result-date">Completed: {new Date(selectedResult.date).toLocaleDateString()}</p>
            </div>

            {selectedResult.testType === "Personality Test" && analyzePersonality(selectedResult) && (
              <div className="analysis-section">
                <h4>Personality Analysis</h4>
                <div className="traits-grid">
                  {Object.entries(analyzePersonality(selectedResult)).map(([key, trait]) => (
                    <div key={key} className="trait-item">
                      <div className="trait-header">
                        <span className="trait-label">{trait.label}</span>
                        <span className="trait-score">{trait.score.toFixed(1)}/5</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: `${trait.percentage}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedResult.testType === "Skills Evaluation" && analyzeSkills(selectedResult) && (
              <div className="analysis-section">
                <h4>Skills Analysis</h4>
                <div className="traits-grid">
                  {Object.entries(analyzeSkills(selectedResult)).map(([key, skill]) => (
                    <div key={key} className="trait-item">
                      <div className="trait-header">
                        <span className="trait-label">{skill.label}</span>
                        <span className="trait-score">{skill.score.toFixed(1)}/5</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: `${skill.percentage}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedResult.testType === "Career Assessment" && analyzeInterests(selectedResult) && (
              <div className="analysis-section">
                <h4>Interest Mapping</h4>
                <div className="traits-grid">
                  {Object.entries(analyzeInterests(selectedResult)).map(([key, interest]) => (
                    <div key={key} className="trait-item">
                      <div className="trait-header">
                        <span className="trait-label">{interest.label}</span>
                        <span className="trait-score">{interest.score.toFixed(1)}/5</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: `${interest.percentage}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="admin-feedback-section">
              <h4>Provide Expert Guidance</h4>
              <div className="feedback-form">
                <div className="form-group">
                  <label>Feedback on Performance:</label>
                  <textarea
                    className="feedback-textarea"
                    placeholder="Provide detailed feedback on the student's performance..."
                    rows="4"
                    value={feedbackForm.feedback}
                    onChange={(e) => setFeedbackForm({...feedbackForm, feedback: e.target.value})}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Career Guidance & Improvement Suggestions:</label>
                  <textarea
                    className="feedback-textarea"
                    placeholder="Suggest career paths and areas for improvement..."
                    rows="4"
                    value={feedbackForm.suggestions}
                    onChange={(e) => setFeedbackForm({...feedbackForm, suggestions: e.target.value})}
                  ></textarea>
                </div>
                <button className="button" onClick={handleSubmitFeedback}>
                  Submit Guidance
                </button>
              </div>

              {getFeedback(selectedIndex) && (
                <div className="existing-feedback">
                  <h5>Previously Submitted Guidance:</h5>
                  <p><strong>Feedback:</strong> {getFeedback(selectedIndex).feedback}</p>
                  <p><strong>Suggestions:</strong> {getFeedback(selectedIndex).suggestions}</p>
                  <p className="feedback-date">Submitted: {new Date(getFeedback(selectedIndex).date).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="admin-controls">
              <div className="filter-section">
                <label>Filter by User ID:</label>
                <select 
                  className="assessment-select"
                  value={filterStudent}
                  onChange={(e) => setFilterStudent(e.target.value)}
                >
                  <option value="">All Students</option>
                  {uniqueStudents.map((student, idx) => (
                    <option key={idx} value={student}>{getStudentDisplayName(student)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="student-stats-grid">
              {uniqueStudents.map((student, idx) => {
                const stats = getStudentStats(student);
                return (
                  <div key={idx} className="student-stat-card">
                    <h4>{getStudentDisplayName(student)}</h4>
                    <p>Tests Completed: <strong>{stats.completedTests}</strong></p>
                    <p>Average Score: <strong>{Math.round(stats.avgScore)}</strong></p>
                    <p>Latest: {stats.latestTest.testType}</p>
                  </div>
                );
              })}
            </div>

            <div className="table-wrap">
              <table className="clean-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Test Type</th>
                    <th>Score</th>
                    <th>Date</th>
                    <th>Feedback Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((r, index) => {
                    const actualIndex = results.indexOf(r);
                    const hasFeedback = getFeedback(actualIndex);
                    return (
                      <tr key={index}>
                        <td>{getStudentDisplayName(getResultUserKey(r))}</td>
                        <td>{r.testType}</td>
                        <td><strong>{r.score}</strong></td>
                        <td>{new Date(r.date).toLocaleDateString()}</td>
                        <td>
                          {hasFeedback ? (
                            <span style={{color: '#10b981'}}>✓ Provided</span>
                          ) : (
                            <span style={{color: '#f59e0b'}}>Pending</span>
                          )}
                        </td>
                        <td>
                          <button 
                            className="button-small"
                            onClick={() => handleViewDetails(r, actualIndex)}
                          >
                            Review & Guide
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StudentResults;
