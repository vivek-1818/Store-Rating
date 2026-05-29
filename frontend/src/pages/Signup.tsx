import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api";
import { getErrorMessage } from "../utils/errors";

export default function Signup() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);

    try {
      await api.post("/auth/signup", {
        name: form.get("name"),
        email: form.get("email"),
        address: form.get("address"),
        password: form.get("password")
      });
      navigate("/login");
    } catch (error) {
      setMessage(getErrorMessage(error, "Signup failed."));
    }
  }

  return (
    <main className="mx-auto min-h-screen w-[min(460px,calc(100%-32px))] py-6 text-gray-900 sm:py-8">
      <h1 className="text-xl font-semibold">Create Account</h1>
      <form className="mt-2 grid gap-4 rounded-lg border border-gray-300 bg-white p-4 sm:p-5" onSubmit={handleSubmit}>
        <label className="grid gap-1.5 font-semibold">
          Name
          <input className="w-full rounded-md border border-gray-400 bg-white p-2.5" name="name" minLength={20} maxLength={60} required />
        </label>
        <label className="grid gap-1.5 font-semibold">
          Email
          <input className="w-full rounded-md border border-gray-400 bg-white p-2.5" type="email" name="email" required />
        </label>
        <label className="grid gap-1.5 font-semibold">
          Address
          <textarea className="min-h-24 w-full resize-y rounded-md border border-gray-400 bg-white p-2.5" name="address" maxLength={400} required />
        </label>
        <label className="grid gap-1.5 font-semibold">
          Password
          <input className="w-full rounded-md border border-gray-400 bg-white p-2.5" type="password" name="password" minLength={8} maxLength={16} required />
        </label>
        {message && <p className="text-red-700">{message}</p>}
        <button className="w-full cursor-pointer rounded-md border-0 bg-emerald-600 px-3.5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-70" type="submit">Sign up</button>
        <Link to="/login">Back to login</Link>
      </form>
    </main>
  );
}

