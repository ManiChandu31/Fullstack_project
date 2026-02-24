import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Simple admin editor for questions.
 * - Select a test type
 * - Add question + options (each option has text and a simple score mapping key:value, e.g. "tech:2")
 * - Persist to localStorage
 */

const STORAGE_KEYS = {
  career: "careerQuestions",
  personality: "personalityQuestions",
  skill: "skillQuestions",
};

// Helpers to parse option score string "tech:2,creative:1" -> {tech:2, creative:1}
function parseScoreString(str) {
  const obj = {};
  (str || "").split(",").forEach((part) => {
    const p = part.split(":").map(s => s && s.trim());
    if (p[0]) obj[p[0]] = Number(p[1] || 1);
  });
  return obj;
}

function ManageTests() {
  const navigate = useNavigate();
  const [type, setType] = useState("career");
  const [items, setItems] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [newOptions, setNewOptions] = useState([
    { text: "", score: "" },
    { text: "", score: "" }
  ]);
  const [editingIndex, setEditingIndex] = useState(-1);

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line
  }, [type]);

  function loadItems() {
    const raw = localStorage.getItem(STORAGE_KEYS[type]);
    if (raw) setItems(JSON.parse(raw));
    else setItems([]);
  }

  function saveItems(next) {
    localStorage.setItem(STORAGE_KEYS[type], JSON.stringify(next));
    setItems(next);
  }

  function handleAddOrUpdate() {
    if (!questionText.trim()) {
      alert("Please enter a question");
      return;
    }
    const opts = newOptions
      .filter(o => o.text.trim())
      .map(o => ({ text: o.text.trim(), score: parseScoreString(o.score) }));

    if (opts.length < 2) {
      alert("Please provide at least 2 answer options for students to choose from");
      return;
    }

    const q = { question: questionText.trim(), options: opts };

    let next = [...items];
    if (editingIndex >= 0) {
      next[editingIndex] = q;
      setEditingIndex(-1);
    } else {
      next.push(q);
    }
    saveItems(next);
    clearForm();
  }

  function clearForm() {
    setQuestionText("");
    setNewOptions([{ text: "", score: "" }, { text: "", score: "" }]);
  }

  function addOptionRow() {
    setNewOptions((prev) => [...prev, { text: "", score: "" }]);
  }

  function removeOptionRow(index) {
    if (newOptions.length <= 2) {
      alert("At least 2 option rows are required for students to have choices");
      return;
    }
    setNewOptions((prev) => prev.filter((_, i) => i !== index));
  }

  function handleDelete(i) {
    if (!confirm("Delete this question?")) return;
    const next = items.filter((_, idx) => idx !== i);
    saveItems(next);
  }

  function handleEdit(i) {
    const q = items[i];
    setEditingIndex(i);
    setQuestionText(q.question);
    setNewOptions(q.options.map(o => ({ text: o.text, score: Object.entries(o.score).map(([k,v]) => `${k}:${v}`).join(",") })));
  }

  function handleConductExam() {
    // Map internal type to display name
    const examTypeMap = {
      career: "Career Assessment",
      personality: "Personality Test",
      skill: "Skills Evaluation"
    };

    if (items.length === 0) {
      alert(`Please add at least one question to the ${examTypeMap[type]} before conducting an exam.`);
      return;
    }

    // Store the selected exam type for pre-filling in schedule page
    localStorage.setItem("selectedExamType", examTypeMap[type]);
    navigate("/admin/schedule-exam");
  }

  return (
    <div className="page-shell">
      <div className="page-card stack-16">
        <h2 className="form-title">Manage Tests (Admin)</h2>

        <div className="test-header-section">
          <div className="form-row inline-actions">
            <label htmlFor="testTypeSelect">Choose test:</label>
            <select id="testTypeSelect" value={type} onChange={(e) => setType(e.target.value)} style={{ maxWidth: 260 }}>
              <option value="career">Career Assessment</option>
              <option value="personality">Personality Test</option>
              <option value="skill">Skills Evaluation</option>
            </select>
          </div>

          <button className="button conduct-exam-btn" onClick={handleConductExam}>
            📝 Conduct Exam
          </button>
        </div>

        <div>
          <h3 className="section-title">{editingIndex >= 0 ? "Edit Question" : "Add Question"}</h3>

          <div className="form-row">
            <textarea
              className="question-input"
              placeholder="Question text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <p className="muted-text" style={{ margin: "6px 0" }}>
              <strong>Answer Options (Required: minimum 2 options)</strong><br/>
              Fill in the option text that students will see. Add score mappings like "tech:2,creative:1" if needed.
            </p>
            {newOptions.map((o, idx) => (
              <div key={idx} className="split-grid option-row" style={{ marginBottom: 8 }}>
                <input
                  placeholder={`Option ${idx + 1} text`}
                  value={o.text}
                  onChange={(e) => {
                    const copy = [...newOptions];
                    copy[idx].text = e.target.value;
                    setNewOptions(copy);
                  }}
                />
                <input
                  placeholder='Score mapping e.g. "tech:2,creative:1"'
                  value={o.score}
                  onChange={(e) => {
                    const copy = [...newOptions];
                    copy[idx].score = e.target.value;
                    setNewOptions(copy);
                  }}
                />

                <div className="option-row-actions">
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => removeOptionRow(idx)}
                  >
                    Remove Option {idx + 1}
                  </button>
                </div>
              </div>
            ))}

            <button className="button secondary" onClick={addOptionRow}>
              Add Option
            </button>
          </div>

          <div className="inline-actions" style={{ marginTop: 12 }}>
            <button className="button" onClick={handleAddOrUpdate}>
              {editingIndex >= 0 ? "Update Question" : "Add Question"}
            </button>
            <button className="button secondary" onClick={clearForm}>
              Clear
            </button>
          </div>
        </div>

        <div>
          <h3 className="section-title">Existing Questions ({items.length})</h3>
          {items.length === 0 && <p>No questions yet for this test.</p>}
          <ul className="clean-list">
            {items.map((q, i) => (
              <li key={i} className="list-item-card" style={{ marginBottom: 12 }}>
                <strong>{i + 1}.</strong> {q.question}
                <div style={{ marginTop: 6 }}>
                  {q.options.map((opt, oi) => (
                    <div key={oi} style={{ fontSize: 14 }}>
                      - {opt.text} (scores: {Object.entries(opt.score).map(([k,v]) => `${k}:${v}`).join(", ")})
                    </div>
                  ))}
                </div>

                <div className="inline-actions" style={{ marginTop: 8 }}>
                  <button className="button" onClick={() => handleEdit(i)}>Edit</button>
                  <button className="button secondary" onClick={() => handleDelete(i)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ManageTests;
