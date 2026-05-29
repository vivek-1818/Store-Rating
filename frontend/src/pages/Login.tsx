import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api";
import { useAuth } from "../state/AuthContext";
import { UserRole } from "../types";
import { getErrorMessage } from "../utils/errors";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await api.post("/auth/login", {
        email: form.get("email"),
        password: form.get("password")
      });
      const role = response.data.role as UserRole;
      login(response.data.token, role, response.data.name);
      navigate(role === "ADMIN" ? "/admin" : role === "STORE_OWNER" ? "/store-owner" : "/dashboard");
    } catch (error) {
      setMessage(getErrorMessage(error, "Login failed. Check your email and password."));
    }
  }

  return (
    <main className="mx-auto min-h-screen w-[min(460px,calc(100%-32px))] py-6 text-gray-900 sm:py-8">
      <h1 className="text-xl font-semibold">Login</h1>
      <form className="mt-2 grid gap-4 rounded-lg border border-gray-300 bg-white p-4 sm:p-5" onSubmit={handleSubmit}>
        <label className="grid gap-1.5 font-semibold">
          Email
          <input className="w-full rounded-md border border-gray-400 bg-white p-2.5" type="email" name="email" required />
        </label>
        <label className="grid gap-1.5 font-semibold">
          Password
          <input className="w-full rounded-md border border-gray-400 bg-white p-2.5" type="password" name="password" required />
        </label>
        {message && <p className="text-red-700">{message}</p>}
        <button className="w-full cursor-pointer rounded-md border-0 bg-emerald-600 px-3.5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-70" type="submit">Login</button>
        <Link to="/signup">Create a normal user account</Link>
      </form>
    </main>
  );
}

