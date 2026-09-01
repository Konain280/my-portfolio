function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-heading"><p>About</p><h2>A little about me</h2></div>
        <div className="about-grid">
          <div className="about-copy">
            <p className="about-lead">I&apos;m a Computer Science student who enjoys turning ideas and coursework into useful, working software.</p>
            <p>My studies at COMSATS University Islamabad have given me a solid foundation in programming, object-oriented design, databases, data structures and algorithms. Outside class, I apply those concepts through web applications and software projects.</p>
            <p>I&apos;m currently improving my React and backend development skills, learning how to structure maintainable applications, and preparing for a software development internship. Long term, I want to grow into a full-stack engineer who can contribute across product and engineering teams.</p>
          </div>
          <dl className="about-details">
            <div><dt>Degree</dt><dd>BS Computer Science</dd></div>
            <div><dt>University</dt><dd>COMSATS University Islamabad</dd></div>
            <div><dt>Campus</dt><dd>Sahiwal</dd></div>
            <div><dt>CGPA</dt><dd>3.62 / 4.00</dd></div>
            <div><dt>Graduation</dt><dd>Expected 2027</dd></div>
            <div><dt>Direction</dt><dd>Full-stack development</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export default About;
