import { Mail } from "lucide-react";
import { FaGithub, FaMedium } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">

        <div className="footer-container">

          <div>
            <h3>
              Konain<span>.</span>
            </h3>

            <p>
              Computer Science Student & Aspiring Full-Stack Developer.
            </p>
          </div>

          <div className="footer-links">

            <a href="#home">Home</a>

            <a href="#about">About</a>

            <a href="#projects">Projects</a>

            <a href="#contact">Contact</a>

            <a
              href="https://github.com/Konain280"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub size={16} /> GitHub
            </a>

            <a href="https://medium.com/@konaintahir22" target="_blank" rel="noreferrer"><FaMedium size={17} /> Medium</a>

            <a href="mailto:konaintahir22@gmail.com"><Mail size={16} /> Email</a>

          </div>

        </div>

        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()} Konain Tahir. All rights reserved.
          </p>

        </div>

      </div>
    </footer>
  );
}

export default Footer;
