function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="container hero-container">

        {/* Left Side */}
        <div className="hero-content">

          <p className="hero-small-text">
            HELLO, I'M
          </p>

          <h1>
            Konain <span>Tahir</span>
          </h1>

          <h2>
            Computer Science Student & Aspiring Full-Stack Developer
          </h2>

          <p className="hero-description">
            I'm a Computer Science student at COMSATS University Islamabad,
            passionate about building modern web applications, software
            solutions and intelligent systems. Currently developing my
            skills in React, JavaScript, Node.js, Python and databases.
          </p>

          <div className="hero-buttons">

            <a href="#projects" className="primary-button">
              View My Projects →
            </a>

            <a
              href="/Konain-CV.pdf"
              className="secondary-button"
              download
            >
              Download CV
            </a>

          </div>

          <div className="hero-socials">

            <a
              href="https://github.com/Konain280"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>

            <a href="#contact">
              Contact Me
            </a>

          </div>

        </div>

        {/* Right Side - Photo */}
        <div className="hero-image-container">

          <div className="hero-image-border">
            <img
              src="/profile.jpg"
              alt="Konain Tahir"
              className="profile-image"
            />
          </div>

          <div className="hero-badge">
            <strong>BSCS</strong>
            <span>Computer Science</span>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;
