import { useCallback, useEffect, useState } from "react";
import { ApiError, apiRequest } from "../api";

const TOKEN_KEY = "portfolio_admin_token";

function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || "");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(Boolean(token));

  const logOut = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken("");
    setMessages([]);
    setLoading(false);
  }, []);

  const handleApiError = useCallback((error) => {
    if (error instanceof ApiError && error.status === 401) logOut();
    setStatus(error.message);
  }, [logOut]);

  const loadMessages = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setStatus("");
    try {
      const data = await apiRequest("/api/contact", { headers: { Authorization: `Bearer ${token}` } });
      setMessages(Array.isArray(data.messages) ? data.messages : []);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [token, handleApiError]);

  useEffect(() => {
    if (!token) return undefined;
    let active = true;

    apiRequest("/api/contact", { headers: { Authorization: `Bearer ${token}` } })
      .then((data) => {
        if (active) setMessages(Array.isArray(data.messages) ? data.messages : []);
      })
      .catch((error) => {
        if (active) handleApiError(error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [token, handleApiError]);

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    try {
      const data = await apiRequest("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
      });
      sessionStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
    } catch (error) {
      setStatus(error.message);
      setLoading(false);
    }
  }

  async function markRead(message) {
    if (message.read_at) return;
    try {
      await apiRequest(`/api/contact/${message.id}/read`, { method: "PATCH", headers: { Authorization: `Bearer ${token}` } });
      setMessages((current) => current.map((item) => item.id === message.id ? { ...item, read_at: new Date().toISOString() } : item));
    } catch (error) { handleApiError(error); }
  }

  async function deleteMessage(message) {
    if (!window.confirm(`Delete the message from ${message.name}? This cannot be undone.`)) return;
    try {
      await apiRequest(`/api/contact/${message.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      setMessages((current) => current.filter((item) => item.id !== message.id));
    } catch (error) { handleApiError(error); }
  }

  if (!token) return (
    <main className="admin-shell"><form className="contact-form admin-login" onSubmit={handleLogin}>
      <a href="/" className="admin-back">← Back to portfolio</a><h1>Admin login</h1>
      <div className="form-group"><label htmlFor="username">Username</label><input id="username" name="username" autoComplete="username" required /></div>
      <div className="form-group"><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required /></div>
      <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
      {status && <p className="form-status error" role="alert">{status}</p>}
    </form></main>
  );

  return (
    <main className="admin-shell"><section className="admin-panel">
      <div className="admin-header"><div><p className="eyebrow">ADMIN PANEL</p><h1>Contact messages</h1><p className="admin-summary">{messages.filter((message) => !message.read_at).length} unread · {messages.length} total</p></div><div className="admin-actions"><button type="button" className="secondary-button" onClick={loadMessages} disabled={loading}>Refresh</button><button type="button" className="secondary-button" onClick={logOut}>Log out</button></div></div>
      {status && <p className="form-status error" role="alert">{status}</p>}
      {loading ? <p>Loading messages...</p> : messages.length === 0 ? <div className="empty-state"><h2>No messages yet</h2><p>New portfolio enquiries will appear here.</p></div> : (
        <div className="admin-messages">{messages.map((message) => (
          <article className={`message-card ${message.read_at ? "is-read" : "is-unread"}`} key={message.id}>
            <div className="message-header"><div><div className="message-title"><h2>{message.name}</h2>{!message.read_at && <span className="unread-badge">New</span>}</div><a href={`mailto:${message.email}`}>{message.email}</a></div><time dateTime={message.created_at}>{new Date(`${message.created_at}Z`).toLocaleString()}</time></div>
            <p>{message.message}</p><div className="message-actions">{!message.read_at && <button type="button" onClick={() => markRead(message)}>Mark as read</button>}<button type="button" className="danger-button" onClick={() => deleteMessage(message)}>Delete</button></div>
          </article>
        ))}</div>
      )}
    </section></main>
  );
}

export default AdminPage;
