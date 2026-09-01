import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { FaGithub, FaMedium } from "react-icons/fa";

const projects = [
  { title: "Full-Stack Developer Portfolio", type: "Featured project", description: "A production portfolio with a React interface, Vercel serverless API, Neon Postgres persistence, Gmail notifications and a JWT-protected admin inbox.", technologies: ["React", "Vite", "Node.js", "Neon", "Vercel"], repoUrl: "https://github.com/Konain280/my-portfolio", liveUrl: "https://konain-portfolio-pi.vercel.app", mediumUrl: "https://medium.com/@konaintahir22", featured: true },
  { title: "CivicPulse Traffic Simulation", type: "Data structures project", description: "A C++ traffic simulator that models city intersections, vehicle queues, signals and shortest-path routing using graph data structures and Dijkstra's algorithm.", technologies: ["C++", "Graphs", "Queues", "Dijkstra"], repoUrl: "https://github.com/Konain280/DS-PROJECT", mediumUrl: "https://medium.com/@konaintahir22/civicpulse-traffic-simulation-in-c-dsa-project-showcase-f6b6d488ffda" },
  { title: "Airline Management System", type: "Database project", description: "A database-backed airline system for managing flights, passenger bookings and authenticated staff workflows.", technologies: ["PHP", "MySQL", "Authentication", "CRUD"], repoUrl: "https://github.com/Konain280/airline_project", mediumUrl: "https://medium.com/@konaintahir22/database-management-system-project-complete-overview-9998c13e10d0" },
  { title: "Hospital Management System", type: "Java semester project", description: "A desktop application for organizing patient registration, doctors, appointments and hospital reporting.", technologies: ["Java", "OOP", "Swing", "File Handling"], repoUrl: "https://github.com/Konain280/hospital-management-system", mediumUrl: "https://medium.com/@konaintahir22/hospital-management-system-using-java-and-object-oriented-programming-c97276455405" },
  { title: "Browser Game", type: "Frontend project", description: "A small browser game built to practise JavaScript state, DOM events and responsive interaction design.", technologies: ["JavaScript", "HTML", "CSS", "DOM"], repoUrl: "https://github.com/Konain280/Game-using-js-" },
];

function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-heading section-heading-split"><div><p>Projects</p><h2>Selected work</h2></div><p className="section-intro">Projects that show how I approach frontend, backend, databases and core computer science concepts.</p></div>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <motion.article className={`project ${project.featured ? "project-featured" : ""}`} key={project.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.12) }}>
              <p className="project-type">{project.type}</p><h3>{project.title}</h3><p className="project-description">{project.description}</p>
              <ul className="project-tech">{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
              <div className="project-actions">
                <a href={project.repoUrl} target="_blank" rel="noreferrer"><FaGithub /> Code <ArrowUpRight /></a>
                {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer"><ExternalLink /> Live site <ArrowUpRight /></a>}
                {project.mediumUrl && <a href={project.mediumUrl} target="_blank" rel="noreferrer"><FaMedium /> Write-up <ArrowUpRight /></a>}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
