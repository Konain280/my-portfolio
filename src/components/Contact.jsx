import { useState } from "react";
import { Mail } from "lucide-react";
import { FaGithub, FaMedium } from "react-icons/fa";
import { apiRequest } from "../api";

const emptyForm = { name: "", email: "", message: "", website: "" };

function Contact() {
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const handleChange = (event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setStatus({ type: "info", message: "Sending..." });
    try {
      const data = await apiRequest("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      setFormData(emptyForm);
      setStatus({ type: "success", message: data.message });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section-heading"><p>Contact</p><h2>Let&apos;s work together</h2></div>
        <div className="contact-grid">
          <div className="contact-copy">
            <p>I&apos;m open to internships, junior development opportunities and project collaborations. If you think I could be a good fit, send me a message.</p>
            <div className="contact-links">
              <a href="mailto:konaintahir22@gmail.com"><span><Mail /></span><div><small>Email</small><strong>konaintahir22@gmail.com</strong></div></a>
              <a href="https://github.com/Konain280" target="_blank" rel="noreferrer"><span><FaGithub /></span><div><small>GitHub</small><strong>github.com/Konain280</strong></div></a>
              <a href="https://medium.com/@konaintahir22" target="_blank" rel="noreferrer"><span><FaMedium /></span><div><small>Medium</small><strong>@konaintahir22</strong></div></a>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row"><div className="form-group"><label htmlFor="name">Name</label><input id="name" name="name" autoComplete="name" maxLength="100" value={formData.name} onChange={handleChange} required /></div><div className="form-group"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" maxLength="254" value={formData.email} onChange={handleChange} required /></div></div>
            <div className="form-group"><label htmlFor="message">Message</label><textarea id="message" name="message" rows="6" maxLength="5000" value={formData.message} onChange={handleChange} required /></div>
            <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex="-1" autoComplete="off" value={formData.website} onChange={handleChange} /></div>
            <button type="submit" disabled={submitting}>{submitting ? "Sending..." : "Send message"}</button>
            {status.message && <p className={`form-status ${status.type}`} role="status" aria-live="polite">{status.message}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
