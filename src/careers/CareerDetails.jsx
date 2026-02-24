import { useParams } from "react-router-dom";

function CareerDetails() {
  const { id } = useParams();

  const careerData = {
    1: {
      title: "Software Engineer",
      description:
        "Software Engineers design, develop, test, and maintain software applications and systems.",
      skills: [
        "Programming (JavaScript, Python, Java)",
        "Problem-Solving",
        "Debugging",
        "Software Architecture",
        "Version Control (Git)"
      ],
      responsibilities: [
        "Write clean, efficient code",
        "Develop software features and modules",
        "Fix bugs and improve performance",
        "Collaborate with developers and designers",
        "Test and deploy applications"
      ],
      salary: "₹5,00,000 – ₹20,00,000 per year",
      bestFor: "Logical thinkers, programmers, problem-solvers",
      education: ["B.Tech in CSE/IT", "BCA", "MCA"],
      growth: "AI Engineer, Full Stack Developer, System Architect"
    },

    2: {
      title: "Data Scientist",
      description:
        "Data Scientists analyze data to uncover insights, build models, and help companies make data-driven decisions.",
      skills: [
        "Python / R",
        "Machine Learning",
        "Data Visualization (Tableau, PowerBI)",
        "Statistics",
        "SQL"
      ],
      responsibilities: [
        "Analyze large datasets",
        "Build ML models",
        "Create dashboards",
        "Identify business insights",
        "Prepare data reports"
      ],
      salary: "₹8,00,000 – ₹30,00,000 per year",
      bestFor: "Analytical thinkers, math lovers, logical problem-solvers",
      education: ["B.Tech, Data Science Degree, MSc Statistics"],
      growth: "AI Specialist, ML Engineer, Data Engineer"
    },

    3: {
      title: "Graphic Designer",
      description:
        "Graphic Designers create visual concepts using computer software to communicate ideas.",
      skills: [
        "Adobe Photoshop / Illustrator",
        "Creativity",
        "UI/UX Basics",
        "Branding & Typography",
        "Color Theory"
      ],
      responsibilities: [
        "Create visual designs and illustrations",
        "Design marketing graphics",
        "Work with teams to create brand identity",
        "Make UI/UX screen layouts",
        "Produce logos, posters, and digital art"
      ],
      salary: "₹3,00,000 – ₹10,00,000 per year",
      bestFor: "Creative thinkers, visual storytellers, artistic minds",
      education: ["B.Des, Diploma in Graphic Design, Fine Arts"],
      growth: "UI/UX Designer, Art Director, Creative Lead"
    }
  };

  const career = careerData[id];

  if (!career) {
    return (
      <div className="page-shell">
        <div className="page-card">
          <p>Career not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-card">
        <h2 className="form-title">Career Details: {career.title}</h2>

        <p>{career.description}</p>

        <h3 className="section-title">Required Skills</h3>
        <ul>
          {career.skills.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>

        <h3 className="section-title">Responsibilities</h3>
        <ul>
          {career.responsibilities.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>

        <h3 className="section-title">Average Salary</h3>
        <p>{career.salary}</p>

        <h3 className="section-title">Best Suited For</h3>
        <p>{career.bestFor}</p>

        <h3 className="section-title">Recommended Education</h3>
        <ul>
          {career.education.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>

        <h3 className="section-title">Growth Opportunities</h3>
        <p>{career.growth}</p>
      </div>
    </div>
  );
}

export default CareerDetails;
