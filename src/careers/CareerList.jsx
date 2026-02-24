import { useNavigate } from "react-router-dom";

function CareerList() {
  const navigate = useNavigate();

  const careers = [
    { id: 1, title: "Software Engineer" },
    { id: 2, title: "Data Scientist" },
    { id: 3, title: "Graphic Designer" }
  ];

  return (
    <div className="page-shell">
      <div className="page-card">
        <h2 className="form-title">Career Options</h2>

        <ul className="clean-list">
        {careers.map((career) => (
          <li
            key={career.id}
            className="career-item list-item-card"
            onClick={() => navigate(`/career-details/${career.id}`)}
            style={{ cursor: "pointer", margin: "10px 0" }}
          >
            <strong>• {career.title}</strong>
          </li>
        ))}
        </ul>
      </div>
    </div>
  );
}

export default CareerList;
