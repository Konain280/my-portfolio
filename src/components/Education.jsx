const education = [
  {
    period: "2023 — 2027",
    level: "Bachelor's Degree",
    title: "Bachelor of Science in Computer Science",
    institute: "COMSATS University Islamabad — Sahiwal Campus",
    details:
      "Currently pursuing BS Computer Science with a strong foundation in programming, object-oriented programming, database systems, and data structures & algorithms.",
    result: "CGPA: 3.62 / 4.00",
  },
  {
    period: "Higher Secondary",
    level: "FSc",
    title: "Higher Secondary Certificate",
    institute: "Pre-Engineering",
    details:
      "Completed FSc Pre-Engineering as part of my higher secondary education.",
    result: "765 / 1200 • Grade B",
  },
  {
    period: "Secondary School",
    level: "Matric",
    title: "Secondary School Certificate",
    institute: "Science Group",
    details:
      "Completed secondary school education with a Science Group background.",
    result: "823 / 1100 • Grade A",
  },
];

function Education() {
  return (
    <section id="education" className="section section-dark">
      <div className="container">

        <div className="section-heading">
          <p>EDUCATION</p>
          <h2>My Academic Journey</h2>
        </div>

        <div className="education-timeline">

          {education.map((item, index) => (
            <div className="education-item" key={item.title}>

              <div className="education-line">
                <div className="education-dot">
                  {index + 1}
                </div>
              </div>

              <div className="education-card">

                <div className="education-top">
                  <span className="education-period">
                    {item.period}
                  </span>

                  <span className="education-level">
                    {item.level}
                  </span>
                </div>

                <h3>{item.title}</h3>

                <h4>{item.institute}</h4>

                <p>{item.details}</p>

                <div className="education-result">
                  {item.result}
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Education;