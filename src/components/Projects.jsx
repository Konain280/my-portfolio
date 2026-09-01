import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FaGithub, FaMedium } from "react-icons/fa";
import { Badge } from "./ui/badge";

const projects = [
  { number: "01", title: "CivicPulse Traffic Simulation", category: "Data Structures", description: "A C++ city traffic simulator that models intersections, vehicle queues, signals and shortest-path routing with graph data structures.", technologies: ["C++", "Graphs", "Queues", "Dijkstra"], repoUrl: "https://github.com/Konain280/DS-PROJECT", mediumUrl: "https://medium.com/@konaintahir22/civicpulse-traffic-simulation-in-c-dsa-project-showcase-f6b6d488ffda" },
  { number: "02", title: "Airline Management System", category: "Full-Stack Web", description: "A database-backed airline system for managing flights, passenger bookings and authenticated staff workflows.", technologies: ["PHP", "MySQL", "Authentication", "CRUD"], repoUrl: "https://github.com/Konain280/airline_project", mediumUrl: "https://medium.com/@konaintahir22/database-management-system-project-complete-overview-9998c13e10d0" },
  { number: "03", title: "Hospital Management System", category: "Desktop Software", description: "A semester project for organizing patient registration, doctors, appointments and hospital reporting in one structured application.", technologies: ["Java", "OOP", "Swing", "File Handling"], repoUrl: "https://github.com/Konain280/hospital-management-system", mediumUrl: "https://medium.com/@konaintahir22/hospital-management-system-using-java-and-object-oriented-programming-c97276455405" },
  { number: "04", title: "Browser Game", category: "Frontend", description: "A compact browser game focused on responsive interactions, clear game state and approachable JavaScript fundamentals.", technologies: ["JavaScript", "HTML", "CSS", "DOM"], repoUrl: "https://github.com/Konain280/Game-using-js-", mediumUrl: "https://medium.com/@konaintahir22" },
  { number: "05", title: "Full-Stack Developer Portfolio", category: "Production Web App", description: "This production portfolio: an animated React interface, serverless contact API, Neon persistence, email delivery and a secured admin inbox.", technologies: ["React", "Vite", "Vercel", "Neon", "Node.js"], repoUrl: "https://github.com/Konain280/my-portfolio", mediumUrl: "https://medium.com/@konaintahir22" },
];

function Projects() {
  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <div className="section-heading section-heading-row"><div><p>SELECTED WORK</p><h2>Projects built to solve real problems.</h2></div><span>Every card links to the source.</span></div>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <motion.article className="project-card" key={project.number} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: index * 0.06 }}>
              <div className="project-top"><span className="project-number">{project.number}</span><Badge>{project.category}</Badge></div>
              <h3>{project.title}</h3><p>{project.description}</p>
              <div className="tech-list">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
              <div className="project-links">
                <a href={project.repoUrl} target="_blank" rel="noreferrer"><FaGithub size={17} /> Repository <ArrowUpRight size={15} /></a>
                <a href={project.mediumUrl} target="_blank" rel="noreferrer"><FaMedium size={18} /> Medium <ArrowUpRight size={15} /></a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
