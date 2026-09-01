const skillCategories = [
  { title: "Frontend", description: "Interfaces and browser applications", skills: ["HTML", "CSS", "JavaScript", "React", "Vite"] },
  { title: "Backend", description: "APIs and server-side development", skills: ["Node.js", "Express", "REST APIs", "Authentication"] },
  { title: "Programming", description: "Languages used in coursework and projects", skills: ["Java", "C++", "Python", "JavaScript"] },
  { title: "Data & tools", description: "Storage, testing and development workflow", skills: ["MySQL", "SQLite", "Git", "GitHub", "Postman", "VS Code"] },
];

function Skills() {
  return (
    <section id="skills" className="section section-muted">
      <div className="container">
        <div className="section-heading"><p>Skills</p><h2>Technologies I work with</h2></div>
        <div className="skills-list">
          {skillCategories.map((category) => (
            <div className="skill-group" key={category.title}>
              <div><h3>{category.title}</h3><p>{category.description}</p></div>
              <ul>{category.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
