import { motion } from "framer-motion";
import { ArrowRight, Download, Mail } from "lucide-react";
import { FaGithub, FaMedium } from "react-icons/fa";
import { buttonVariants } from "./ui/button-variants";

function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="container hero-container">
        <motion.div className="hero-content" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="hero-eyebrow">Hi, I&apos;m Konain Tahir.</p>
          <h1>Computer Science Student &amp; Developer</h1>
          <p className="hero-description">I build practical web applications and software projects with React, JavaScript, Node.js, Java, C++ and relational databases. I&apos;m currently looking for internship opportunities where I can contribute and keep learning.</p>
          <div className="hero-buttons">
            <a href="#projects" className={buttonVariants({ variant: "primary" })}>View my work <ArrowRight size={17} /></a>
            <a href="/Konain-CV.pdf" className={buttonVariants({ variant: "outline" })} download><Download size={17} /> Download CV</a>
          </div>
          <div className="hero-socials">
            <a href="https://github.com/Konain280" target="_blank" rel="noreferrer"><FaGithub size={17} /> GitHub</a>
            <a href="https://medium.com/@konaintahir22" target="_blank" rel="noreferrer"><FaMedium size={18} /> Medium</a>
            <a href="mailto:konaintahir22@gmail.com"><Mail size={17} /> Email</a>
          </div>
        </motion.div>
        <motion.div className="hero-image-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="hero-image-border"><img src="/profile.jpg" alt="Konain Tahir" className="profile-image" width="480" height="600" fetchPriority="high" /></div>
          <p className="hero-image-caption">Based in Sahiwal, Pakistan</p>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
