import { Mail } from "lucide-react";
import { FaGithub, FaMedium } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <p>© {new Date().getFullYear()} Konain Tahir</p>
        <nav aria-label="Footer links">
          <a href="https://github.com/Konain280" target="_blank" rel="noreferrer"><FaGithub /> GitHub</a>
          <a href="https://medium.com/@konaintahir22" target="_blank" rel="noreferrer"><FaMedium /> Medium</a>
          <a href="mailto:konaintahir22@gmail.com"><Mail /> Email</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
