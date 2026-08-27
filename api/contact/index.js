import { verifyToken } from "../_lib/auth.js";
import { parseContact } from "../_lib/contact.js";
import { getDatabase } from "../_lib/database.js";
import { prepareRequest, requireAdmin, handleError } from "../_lib/http.js";
import { sendContactNotification } from "../_lib/mail.js";
import { enforceRateLimit } from "../_lib/rate-limit.js";

export default async function handler(req, res) {
  if (!prepareRequest(req, res, ["GET", "POST"])) return;
  try {
    const database = await getDatabase();
    if (req.method === "GET") {
      if (!requireAdmin(req, res, verifyToken)) return;
      return res.status(200).json({ success: true, messages: await database.listContacts() });
    }
    if (Buffer.byteLength(JSON.stringify(req.body || {}), "utf8") > 20 * 1024) {
      return res.status(413).json({ success: false, message: "Request body is too large." });
    }
    if (!enforceRateLimit(req, res, { name: "contact", windowMs: 15 * 60 * 1000, limit: 5, message: "Too many messages sent. Please try again later." })) return;
    const parsed = parseContact(req.body);
    if (parsed.error) return res.status(400).json({ success: false, message: parsed.error });
    const id = await database.createContact(parsed.value);
    const emailSent = await sendContactNotification({ id, ...parsed.value });
    return res.status(201).json({
      success: true,
      emailSent,
      message: emailSent ? "Your message was sent successfully." : "Your message was received successfully.",
    });
  } catch (error) {
    return handleError(error, res, "The contact request could not be completed.");
  }
}
