import { useEffect, useState } from "react";

const links = [
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Projects", "#projects"],
  ["Education", "#education"],
  ["Contact", "#contact"],
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    const sections = [...document.querySelectorAll("main section[id]")];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65%", threshold: [0, 0.2, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="navbar">
      <div className="container nav-container">
        <a href="#home" className="logo" onClick={() => setOpen(false)} aria-label="Konain Tahir, home">Konain Tahir<span>.</span></a>
        <button type="button" className="menu-toggle" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen((current) => !current)}>
          <span /><span /><span />
        </button>
        <nav id="primary-navigation" className={open ? "nav-open" : ""} aria-label="Primary navigation">
          {links.map(([label, href]) => <a href={href} key={href} aria-current={activeSection === href.slice(1) ? "page" : undefined} onClick={() => setOpen(false)}>{label}</a>)}
          <a href="/Konain-CV.pdf" className="mobile-cv-link" download onClick={() => setOpen(false)}>Download CV</a>
        </nav>
        <a href="/Konain-CV.pdf" className="nav-button" download>Download CV</a>
      </div>
    </header>
  );
}

export default Navbar;
