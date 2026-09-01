function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-heading"><p>About</p><h2>A little about me</h2></div>
        <div className="about-grid">
          <div className="about-copy">
            <p className="about-lead">I&apos;m a student developer who likes understanding how software works from the interface down to the database.</p>
            <p>I started with Java and data structures at university, then moved into web development because I wanted to build things people could actually use. Most of my recent work involves React, JavaScript, Node.js and relational databases.</p>
            <p>Right now I&apos;m learning how to write cleaner frontend code, design dependable APIs and structure full-stack applications. I&apos;m looking for an internship where I can contribute to real work, learn from code reviews and become a better engineer.</p>
          </div>
          <div className="about-notes">
            <div><h3>Currently learning</h3><p>React application structure, backend APIs and production deployment.</p></div>
            <div><h3>Interested in</h3><p>Frontend engineering, full-stack development and practical software systems.</p></div>
            <div><h3>Career direction</h3><p>Growing into a dependable full-stack software engineer.</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
