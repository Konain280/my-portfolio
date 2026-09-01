function About() {
  return (
    <section id="about" className="section about-section">
      <div className="container">

        <div className="section-heading">
          <p>ABOUT ME</p>
          <h2>A student who learns by shipping.</h2>
        </div>

        <div className="about-grid">

          {/* About Text */}
          <div className="about-text">

            <h3>
              I care more about working software than impressive-sounding stacks.
            </h3>

            <p>
              I'm currently pursuing a Bachelor of Science in Computer
              Science at COMSATS University Islamabad, Sahiwal Campus.
              My academic journey has helped me build a strong foundation
              in programming, object-oriented programming, databases,
              data structures and algorithms.
            </p>

            <p>
              I started with Java and data structures, then moved toward web development because I wanted other people to actually use what I built. Today I work mostly with JavaScript, React, Node.js, relational databases and Python.
            </p>

            <p>
              My process is simple: understand the problem, make the smallest useful version, test it, and improve the parts that matter. I’m looking for an internship where I can contribute, get reviewed by experienced engineers and grow faster.
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
