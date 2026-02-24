import { useState, useEffect } from "react";

function CareerRecommendations() {
  const [careerList, setCareerList] = useState([]);
  const [newCareer, setNewCareer] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Load existing recommendations
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("careerRecommendations")) || [];
    setCareerList(saved);
  }, []);

  // Save recommendations to localStorage
  const saveRecommendations = (updatedList) => {
    setCareerList(updatedList);
    localStorage.setItem("careerRecommendations", JSON.stringify(updatedList));
  };

  // Add new recommendation
  const handleAdd = () => {
    if (!newCareer.trim() || !newDescription.trim()) {
      alert("Please fill out both fields");
      return;
    }

    const updated = [
      ...careerList,
      { id: Date.now(), title: newCareer, description: newDescription }
    ];

    saveRecommendations(updated);

    setNewCareer("");
    setNewDescription("");
    alert("Recommendation added!");
  };

  // Delete recommendation
  const handleDelete = (id) => {
    const updated = careerList.filter((item) => item.id !== id);
    saveRecommendations(updated);
    alert("Recommendation deleted!");
  };

  return (
    <div className="page-shell">
      <div className="page-card">
        <h2 className="form-title">Manage Career Recommendations</h2>

        <div className="form-row">
          <input
            type="text"
            placeholder="Career Title"
            value={newCareer}
            onChange={(e) => setNewCareer(e.target.value)}
          />
        </div>

        <div className="form-row">
          <textarea
            placeholder="Career Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
        </div>

        <button className="button" onClick={handleAdd}>
          Add Recommendation
        </button>

        <h3 className="section-title" style={{ marginTop: 18 }}>Existing Recommendations</h3>

        {careerList.length === 0 ? (
          <p>No recommendations added yet.</p>
        ) : (
          <ul className="clean-list">
            {careerList.map((item) => (
              <li key={item.id} className="list-item-card" style={{ marginBottom: 10 }}>
                <strong>{item.title}</strong>
                <p>{item.description}</p>

                <button
                  className="button secondary"
                  style={{ marginTop: "5px" }}
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CareerRecommendations;
