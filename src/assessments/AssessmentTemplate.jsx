import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * props:
 * - title
 * - questions (optional) -> if you pass, it will use directly
 * - storageKey (e.g. 'careerQuestions') to read from localStorage if not passed
 * - resultKey (where to store the partial result like 'careerResults')
 */

function AssessmentTemplate({ title, questions: initialQuestions, storageKey, resultKey }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState({});
  const [questions, setQuestions] = useState(initialQuestions || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initialQuestions && storageKey) {
      const raw = localStorage.getItem(storageKey);
      try {
        const parsed = raw ? JSON.parse(raw) : [];
        setQuestions(parsed);
      } catch {
        setQuestions([]);
      }
    }
    setLoading(false);
    // eslint-disable-next-line
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!questions || questions.length === 0) {
    return <div>
      <h2 className="form-title">{title}</h2>
      <p>No questions available yet. Ask admin to add questions.</p>
    </div>;
  }

  const q = questions[index];

  const pct = Math.round(((index) / questions.length) * 100);

  function saveAttempt(finalScores) {
    // Attach user identification if available
    const user = JSON.parse(localStorage.getItem("userData")) || {};
    const email = user.email || "guest";

    const attemptsRaw = localStorage.getItem("attempts");
    const attempts = attemptsRaw ? JSON.parse(attemptsRaw) : [];
    const attempt = {
      id: Date.now(),
      user: email,
      date: new Date().toISOString(),
      type: resultKey,
      scores: finalScores
    };
    attempts.push(attempt);
    localStorage.setItem("attempts", JSON.stringify(attempts));
  }

  const handleAnswer = (option) => {
    const newScores = { ...scores };

    for (const key in option.score) {
      newScores[key] = (newScores[key] || 0) + option.score[key];
    }

    setScores(newScores);

    // Next or finish
    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      // store final scores for this test
      localStorage.setItem(resultKey, JSON.stringify(newScores));
      saveAttempt(newScores);
      navigate("/test-result");
    }
  };

  return (
    <div>
      <h2 className="form-title">{title}</h2>

      {/* Progress bar */}
      <div style={{ margin: "12px 0" }}>
        <div style={{ height: 10, background: "#e6eef9", borderRadius: 6, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "#2b6cb0" }} />
        </div>
        <div style={{ marginTop: 6, fontSize: 13, color: "#374151" }}>
          Question {index + 1} / {questions.length} ({pct}%)
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h3>{q.question}</h3>

        <div style={{ marginTop: 8 }}>
          {q.options.map((opt, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <button className="button" onClick={() => handleAnswer(opt)}>
                {opt.text}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AssessmentTemplate;
