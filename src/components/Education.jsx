const education = [
  { period: "2023 — 2027", title: "Bachelor of Science in Computer Science", institution: "COMSATS University Islamabad, Sahiwal Campus", details: "Coursework includes programming fundamentals, object-oriented programming, database systems, data structures and algorithms.", result: "CGPA 3.62 / 4.00" },
  { period: "Higher Secondary", title: "FSc Pre-Engineering", institution: "Higher Secondary Certificate", details: "Mathematics, physics and chemistry foundation before beginning university studies in computer science.", result: "765 / 1200 · Grade B" },
  { period: "Secondary School", title: "Matric — Science Group", institution: "Secondary School Certificate", details: "Completed secondary education with a science-focused curriculum.", result: "823 / 1100 · Grade A" },
];

function Education() {
  return (
    <section id="education" className="section section-muted">
      <div className="container">
        <div className="section-heading"><p>Education</p><h2>Academic background</h2></div>
        <div className="education-list">
          {education.map((item) => (
            <article className="education-item" key={item.title}>
              <p className="education-period">{item.period}</p>
              <div><h3>{item.title}</h3><p className="education-institution">{item.institution}</p><p>{item.details}</p></div>
              <p className="education-result">{item.result}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Education;
