const projects = [
  {
    number: "01",
    title: "CivicPulse — AI Traffic & Transportation System",
    category: "AI / Full-Stack",
    description:
      "An intelligent transportation system designed to simulate city traffic, optimize routes and manage transportation operations using graph algorithms and AI-based route planning.",
    technologies: [
      "Python",
      "FastAPI",
      "React",
      "SQLite",
      "A*",
      "Dijkstra",
    ],
  },

  {
    number: "02",
    title: "Autonomous AI Research Assistant",
    category: "Artificial Intelligence",
    description:
      "An AI research assistant system designed to search for information, process sources, summarize content and generate structured research reports.",
    technologies: [
      "Python",
      "FastAPI",
      "React",
      "AI",
      "Web Scraping",
    ],
  },

  {
    number: "03",
    title: "Traffic Simulation System",
    category: "AI / Algorithms",
    description:
      "A traffic simulation project using graph-based route optimization algorithms to calculate efficient paths between different locations.",
    technologies: [
      "Python",
      "A*",
      "Dijkstra",
      "Tkinter",
      "Graph Algorithms",
    ],
  },

  {
    number: "04",
    title: "Java Hospital Patient Management System",
    category: "Software Development",
    description:
      "A desktop-based patient management system designed to manage hospital records, patients and related operations through a structured software interface.",
    technologies: [
      "Java",
      "OOP",
      "Java Swing",
      "File Handling",
    ],
  },

  {
    number: "05",
    title: "JavaScript Rock Paper Scissors Game",
    category: "Web Development",
    description:
      "An interactive browser-based game developed to practice JavaScript logic, DOM manipulation, events and dynamic user interaction.",
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "DOM",
    ],
  },

  {
    number: "06",
    title: "Developer Portfolio",
    category: "Full-Stack Web Development",
    description:
      "A modern responsive developer portfolio built to showcase projects, technical skills, education and professional information.",
    technologies: [
      "React",
      "JavaScript",
      "CSS",
      "Vite",
      "Node.js",
    ],
  },
];

function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container">

        <div className="section-heading">
          <p>MY WORK</p>
          <h2>Featured Projects</h2>
        </div>

        <div className="projects-grid">

          {projects.map((project) => (
            <article
              className="project-card"
              key={project.number}
            >

              <div className="project-top">
                <span className="project-number">
                  {project.number}
                </span>

                <span className="project-category">
                  {project.category}
                </span>
              </div>

              <h3>{project.title}</h3>

              <p>{project.description}</p>

              <div className="tech-list">
                {project.technologies.map((technology) => (
                  <span key={technology}>
                    {technology}
                  </span>
                ))}
              </div>

              {project.url && (
                <a className="project-footer" href={project.url} target="_blank" rel="noreferrer">
                  <span>View Project</span><span className="project-arrow" aria-hidden="true">↗</span>
                </a>
              )}

            </article>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Projects;
