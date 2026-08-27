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
              GitHub
            </a>

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