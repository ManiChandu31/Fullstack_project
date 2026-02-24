import { useEffect, useState } from "react";

function TestResult() {
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const loggedUser = localStorage.getItem("loggedInUser");
    const loggedUserEmail = localStorage.getItem("loggedInUserEmail");
    const attempts = JSON.parse(localStorage.getItem("attempts")) || [];
    const myResults = attempts.filter((a) => a.user === loggedUser || a.user === loggedUserEmail);
    setResults(myResults);
  }, []);

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
      { category: "teamwork" },
      { category: "creativity" },
      { category: "communication" },
      { category: "social" },
      { category: "emotional" },
      { category: "empathy" },
      { category: "adaptability" },
      { category: "openness" },
      { category: "organization" },
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
      { category: "technical" },
      { category: "planning" },
      { category: "communication" },
      { category: "time-management" },
      { category: "pressure" },
      { category: "learning" },
      { category: "collaboration" },
      { category: "presentation" },
      { category: "problem-solving" },
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

    // Questions 0,1,3 = technology interest
    // Questions 0,2,8 = analytical interest  
    // Questions 5,6 = detail-oriented
    // Questions 9,7 = independent work

    const mapping = [
      ["technology", "analytical"],
      ["technology"],
      ["analytical"],
      ["technology"],
      [],
      ["detail"],
      ["detail"],
      ["independent"],
      ["analytical"],
      ["independent"]
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

  const getCareerRecommendations = () => {
    const careerResult = results.find(r => r.testType === "Career Assessment");
    const personalityResult = results.find(r => r.testType === "Personality Test");
    const skillsResult = results.find(r => r.testType === "Skills Evaluation");

    const careers = [];

    if (careerResult && careerResult.score >= 70) {
      careers.push({
        title: "Software Engineer",
        match: "95%",
        reason: "Strong technical aptitude and logical thinking skills",
        path: "Bachelor's in Computer Science → Junior Developer → Senior Engineer"
      });
      careers.push({
        title: "Data Scientist",
        match: "90%",
        reason: "Excellent analytical and problem-solving abilities",
        path: "Bachelor's in Data Science/Statistics → Data Analyst → Data Scientist"
      });
    }

    if (personalityResult && skillsResult) {
      const personalityAnalysis = analyzePersonality(personalityResult);
      const skillsAnalysis = analyzeSkills(skillsResult);

      if (personalityAnalysis?.creativity?.score >= 4) {
        careers.push({
          title: "UX/UI Designer",
          match: "88%",
          reason: "High creativity combined with technical understanding",
          path: "Design Degree → Junior Designer → UX Lead"
        });
      }

      if (skillsAnalysis?.communication?.score >= 4 && personalityAnalysis?.teamwork?.score >= 4) {
        careers.push({
          title: "Project Manager",
          match: "85%",
          reason: "Strong communication and team collaboration skills",
          path: "Business/IT Degree → Team Lead → Project Manager → Senior PM"
        });
      }

      if (skillsAnalysis?.technical?.score >= 4) {
        careers.push({
          title: "DevOps Engineer",
          match: "87%",
          reason: "Technical expertise with systematic problem-solving",
          path: "Computer Science Degree → System Admin → DevOps Engineer"
        });
      }
    }

    if (careers.length === 0) {
      careers.push({
        title: "Business Analyst",
        match: "78%",
        reason: "Versatile skills applicable to business and technology",
        path: "Business Degree → Junior Analyst → Business Analyst → Senior Analyst"
      });
      careers.push({
        title: "IT Consultant",
        match: "75%",
        reason: "Balanced technical and communication abilities",
        path: "IT Degree → Junior Consultant → IT Consultant → Senior Consultant"
      });
    }

    return careers.slice(0, 5);
  };

  const getFeedback = (resultId) => {
    const feedback = JSON.parse(localStorage.getItem("adminFeedback")) || [];
    return feedback.find(f => f.resultId === resultId);
  };

  return (
    <div className="page-shell">
      <div className="page-card">
        <h2 className="form-title">My Assessment Results</h2>

        {results.length === 0 ? (
          <p style={{textAlign: 'center', padding: '2rem'}}>No test results found. Please complete an assessment.</p>
        ) : selectedResult ? (
          <div className="result-detail">
            <button className="button" onClick={() => setSelectedResult(null)} style={{marginBottom: '1rem'}}>
              ← Back to All Results
            </button>

            <div className="result-header">
              <h3>{selectedResult.testType}</h3>
              <div className="result-score">
                <span className="score-label">Overall Score:</span>
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

            {getFeedback(results.indexOf(selectedResult)) && (
              <div className="admin-feedback-section">
                <h4>Expert Guidance from Admin</h4>
                <div className="feedback-content">
                  <p><strong>Feedback:</strong> {getFeedback(results.indexOf(selectedResult)).feedback}</p>
                  <p><strong>Suggestions:</strong> {getFeedback(results.indexOf(selectedResult)).suggestions}</p>
                  <p className="feedback-date">Provided on: {new Date(getFeedback(results.indexOf(selectedResult)).date).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="results-summary">
              <div className="summary-card">
                <h3>Assessments Completed</h3>
                <p className="summary-number">{results.length}</p>
              </div>
              <div className="summary-card">
                <h3>Average Score</h3>
                <p className="summary-number">
                  {results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length) : 0}
                </p>
              </div>
              <div className="summary-card">
                <h3>Latest Assessment</h3>
                <p className="summary-text">
                  {results.length > 0 ? results[results.length - 1].testType : "None"}
                </p>
              </div>
            </div>

            <div className="table-wrap">
              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Test Type</th>
                    <th>Score</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((res, index) => (
                    <tr key={index}>
                      <td>{res.testType}</td>
                      <td><strong>{res.score}</strong></td>
                      <td>{new Date(res.date).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className="button-small"
                          onClick={() => setSelectedResult(res)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {results.length >= 2 && (
              <div className="career-recommendations">
                <h3>Recommended Career Paths</h3>
                <p className="recommendations-intro">
                  Based on your assessment results, here are career paths that match your profile:
                </p>
                <div className="careers-grid">
                  {getCareerRecommendations().map((career, idx) => (
                    <div key={idx} className="career-card">
                      <div className="career-header">
                        <h4>{career.title}</h4>
                        <span className="career-match">{career.match} Match</span>
                      </div>
                      <p className="career-reason"><strong>Why:</strong> {career.reason}</p>
                      <p className="career-path"><strong>Path:</strong> {career.path}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TestResult;
