import { assertAuthConfig } from "./_lib/auth.js";
import { getDatabase } from "./_lib/database.js";
import { prepareRequest, handleError } from "./_lib/http.js";
import { isEmailConfigured } from "./_lib/mail.js";

export default async function handler(req, res) {
  if (!prepareRequest(req, res, ["GET"])) return;
  try {
    assertAuthConfig();
    const database = await getDatabase();
    await database.health();
    res.status(200).json({ success: true, database: "connected", databaseType: database.type, emailConfigured: isEmailConfigured() });
  } catch (error) {
    handleError(error, res, "The API health check failed.");
  }
}
