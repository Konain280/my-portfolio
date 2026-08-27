const skillCategories = [
  {
    title: "Programming",
    skills: ["Java", "JavaScript", "Python", "C++"],
  },
  {
    title: "Frontend",
    skills: ["HTML", "CSS", "JavaScript", "React"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express.js", "REST APIs"],
  },
  {
    title: "Database",
    skills: ["MySQL", "SQLite", "Database Systems"],
  },
  {
    title: "AI & Algorithms",
    skills: ["Machine Learning", "A*", "Dijkstra", "Data Structures"],
  },
  {
    title: "Tools",
    skills: ["Git", "GitHub", "VS Code", "Postman", "XAMPP"],
  },
];

function Skills() {
  return (
    <section id="skills" className="section section-dark">
      <div className="container">

        <div className="section-heading">
          <p>MY EXPERTISE</p>
          <h2>Skills & Technologies</h2>
        </div>

        <div className="skills-category-grid">

          {skillCategories.map((category) => (
            <div className="skill-category" key={category.title}>

              <h3>{category.title}</h3>

              <div className="skill-tags">
                {category.skills.map((skill) => (
                  <span key={skill}>
                    {skill}
                  </span>
                ))}
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Skills;