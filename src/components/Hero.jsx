import { motion } from "framer-motion";
import { ArrowRight, Download, Mail, MapPin } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { buttonVariants } from "./ui/button-variants";

function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="container hero-container">
        <motion.div className="hero-content" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
          <p className="hero-small-text"><span /> OPEN TO INTERNSHIPS · 2026</p>
          <h1>Full-stack developer.<span>Computer science student.</span></h1>
          <h2>I’m Konain Tahir, based in Sahiwal and studying at COMSATS University Islamabad.</h2>
          <p className="hero-description">I like projects with moving parts: data structures, databases, interfaces and the backend logic that holds them together. This site is where I document what I’m learning by building.</p>
          <div className="hero-buttons">
            <a href="#projects" className={buttonVariants({ variant: "primary" })}>View selected work <ArrowRight size={17} /></a>
            <a href="/Konain-CV.pdf" className={buttonVariants({ variant: "outline" })} download><Download size={17} /> Download CV</a>
          </div>
          <div className="hero-socials">
            <a href="https://github.com/Konain280" target="_blank" rel="noreferrer"><FaGithub size={17} /> GitHub</a>
            <a href="mailto:konaintahir22@gmail.com"><Mail size={17} /> Email</a>
            <span><MapPin size={17} /> Sahiwal, Pakistan</span>
          </div>
          <dl className="hero-proof">
            <div><dt>3.62</dt><dd>CGPA</dd></div>
            <div><dt>05</dt><dd>Public projects</dd></div>
            <div><dt>2027</dt><dd>Graduation</dd></div>
          </dl>
        </motion.div>
        <motion.div className="hero-image-container" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.12 }}>
          <div className="hero-image-border"><img src="/profile.jpg" alt="Konain Tahir" className="profile-image" /></div>
          <div className="hero-badge"><strong>Currently</strong><span>BSCS · 6th semester</span></div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
