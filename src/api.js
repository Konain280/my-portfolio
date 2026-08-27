export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest(path, options = {}) {
  let response;
  try {
    response = await fetch(path, options);
  } catch {
    throw new ApiError("The server is unavailable. Please try again later.", 0);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new ApiError(
      response.ok
        ? "The API is not configured correctly. Please try again later."
        : `Request failed (${response.status}).`,
      response.status,
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new ApiError("The server returned an invalid response. Please try again later.", response.status);
  }

  if (!response.ok) throw new ApiError(data.message || `Request failed (${response.status}).`, response.status);
  return data;
}
