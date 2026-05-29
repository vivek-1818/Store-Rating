import { useState } from "react";
import api from "../api";

export default function PasswordForm({ onClose }: any) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const form = new FormData(e.target);

    try {
      setLoading(true);

      await api.put("/user/password", {
        oldPassword: form.get("oldPassword"),
        newPassword: form.get("newPassword"),
      });

      setMessage("Password updated successfully");
      e.target.reset();
    } catch (error) {
      setMessage("Failed to update password");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-lg border border-gray-300 bg-white p-4"
    >
      <h2 className="text-lg font-semibold">Update Password</h2>

      <input type="password" name="oldPassword" placeholder="Current Password" required className="rounded border p-2"/>

      <input type="password" name="newPassword" placeholder="New Password" required className="rounded border p-2"/>

      {message && <p>{message}</p>}

      <button type="submit" disabled={loading} className="rounded bg-emerald-600 p-2 text-white">
        {loading ? "Updating..." : "Update Password"}
      </button>

      {onClose && (
        <button type="button" onClick={onClose} className="rounded bg-gray-200 p-2">
          Cancel
        </button>
      )}
    </form>
  );
}
