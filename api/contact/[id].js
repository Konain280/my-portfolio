import { verifyToken } from "../_lib/auth.js";
import { parseId } from "../_lib/contact.js";
import { getDatabase } from "../_lib/database.js";
import { prepareRequest, requireAdmin, handleError } from "../_lib/http.js";

export default async function handler(req, res) {
  if (!prepareRequest(req, res, ["DELETE"])) return;
  if (!requireAdmin(req, res, verifyToken)) return;
  const id = parseId(req.query.id);
  if (!id) return res.status(400).json({ success: false, message: "Invalid message ID." });
  try {
    const found = await (await getDatabase()).deleteContact(id);
    if (!found) return res.status(404).json({ success: false, message: "Message not found." });
    return res.status(200).json({ success: true });
  } catch (error) {
    return handleError(error, res, "The message could not be deleted.");
  }
}
