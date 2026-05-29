export function getErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object") {
    const response = "response" in error ? error.response : undefined;

    if (response && typeof response === "object") {
      const data = "data" in response ? response.data : undefined;
      const status = "status" in response ? response.status : undefined;

      if (data && typeof data === "object" && "message" in data && typeof data.message === "string" && data.message.trim()) {
        return data.message;
      }

      if (typeof data === "string" && data.trim()) {
        return data;
      }

      if (typeof status === "number") {
        return `Request failed with status ${status}. Please restart the backend and try again.`;
      }
    }

    if ("request" in error) {
      return "Could not reach the server. Please check that the backend is running.";
    }

    if ("message" in error && typeof error.message === "string" && error.message.trim()) {
      return error.message;
    }
  }

  return fallback;
}
