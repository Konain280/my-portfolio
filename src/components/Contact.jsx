import { useState } from "react";
import { apiRequest } from "../api";
import { Mail } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const emptyForm = { name: "", email: "", message: "", website: "" };

function Contact() {
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setStatus({ type: "info", message: "Sending..." });

    try {
      const data = await apiRequest("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setFormData(emptyForm);
      setStatus({ type: "success", message: data.message });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section section-dark">
      <div className="container">
        <div className="section-heading"><p>GET IN TOUCH</p><h2>Contact Me</h2></div>
        <div className="contact-grid">
          <div className="contact-info">
            <h3>Let's work together.</h3>
            <p>Have a project, opportunity, or question? Send me a message and I'll get back to you.</p>
            <div className="contact-details">
              <div className="contact-detail"><div className="contact-icon" aria-hidden="true"><Mail size={20} /></div><div><small>Email</small><a href="mailto:konaintahir22@gmail.com">konaintahir22@gmail.com</a></div></div>
              <div className="contact-detail"><div className="contact-icon" aria-hidden="true"><FaGithub size={20} /></div><div><small>GitHub</small><a href="https://github.com/Konain280" target="_blank" rel="noreferrer">github.com/Konain280</a></div></div>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group"><label htmlFor="name">Name</label><input id="name" name="name" autoComplete="name" maxLength="100" placeholder="Your name" value={formData.name} onChange={handleChange} required /></div>
            <div className="form-group"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" maxLength="254" placeholder="your@email.com" value={formData.email} onChange={handleChange} required /></div>
            <div className="form-group"><label htmlFor="message">Message</label><textarea id="message" name="message" rows="6" maxLength="5000" placeholder="Write your message..." value={formData.message} onChange={handleChange} required /></div>
            <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex="-1" autoComplete="off" value={formData.website} onChange={handleChange} /></div>
            <button type="submit" disabled={submitting}>{submitting ? "Sending..." : "Send Message →"}</button>
            {status.message && <p className={`form-status ${status.type}`} role="status" aria-live="polite">{status.message}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
