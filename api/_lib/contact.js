export function parseContact(body = {}) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";
  if (website) return { error: "Message rejected." };
  if (!name || !email || !message) return { error: "All fields are required." };
  if (/[\r\n]/.test(name)) return { error: "Name contains invalid characters." };
  if (name.length > 100 || email.length > 254 || message.length > 5000) return { error: "One or more fields are too long." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };
  return { value: { name, email, message } };
}

export function parseId(value) {
  const id = Number(Array.isArray(value) ? value[0] : value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
