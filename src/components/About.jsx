function About() {
  return (
    <section id="about" className="section about-section">
      <div className="container">

        <div className="section-heading">
          <p>ABOUT ME</p>
          <h2>Who I Am</h2>
        </div>

        <div className="about-grid">

          {/* About Text */}
          <div className="about-text">

            <h3>
              Computer Science student passionate about
              software and modern web development.
            </h3>

            <p>
              I'm currently pursuing a Bachelor of Science in Computer
              Science at COMSATS University Islamabad, Sahiwal Campus.
              My academic journey has helped me build a strong foundation
              in programming, object-oriented programming, databases,
              data structures and algorithms.
            </p>

            <p>
              I'm particularly interested in building practical software
              solutions and modern web applications. I'm currently
              developing my skills in JavaScript, React, Node.js, Python,
              databases and full-stack development.
            </p>

            <p>
              I enjoy turning ideas into working projects and continuously
              improving my programming and problem-solving skills through
              hands-on projects.
            </p>

          </div>

          {/* Information Cards */}
          <div className="about-info">

            <div className="info-card">
              <span>Education</span>
              <strong>BS Computer Science</strong>
            </div>

            <div className="info-card">
              <span>University</span>
              <strong>COMSATS University Islamabad</strong>
            </div>

            <div className="info-card">
              <span>Campus</span>
              <strong>Sahiwal Campus</strong>
            </div>

            <div className="info-card">
              <span>CGPA</span>
              <strong>3.62 / 4.00</strong>
            </div>

            <div className="info-card">
              <span>Expected Graduation</span>
              <strong>2027</strong>
            </div>

            <div className="info-card">
              <span>Focus</span>
              <strong>Web & Full-Stack Development</strong>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default About;