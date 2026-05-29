import { useEffect, useState } from "react";

import api from "../api";
import PasswordForm from "../components/PasswordForm";
import { useAuth } from "../state/AuthContext";
import { getErrorMessage } from "../utils/errors";

interface RatingUser {
  id: number;
  name: string;
  email: string;
  address: string;
  rating: number;
}

interface OwnerData {
  store: { name: string; email: string; address: string } | null;
  averageRating: number | null;
  users: RatingUser[];
}

export default function StoreOwnerDashboard() {
  const { logout } = useAuth();
  const [data, setData] = useState<OwnerData | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/store-owner/dashboard")
      .then((response) => setData(response.data))
      .catch((error) => setMessage(getErrorMessage(error, "Could not load store owner dashboard.")));
  }, []);

  return (
    <main className="mx-auto min-h-screen w-[min(1100px,calc(100%-32px))] py-6 text-gray-900 sm:py-8">
      <header className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">Store Owner Dashboard</h1>
        <div className="grid gap-2 sm:flex sm:items-center">
          <button className="w-full cursor-pointer rounded-md border-0 bg-emerald-600 px-3.5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto" type="button" onClick={() => setShowPasswordForm((isShown) => !isShown)}>
            Update Password
          </button>
          <button className="w-full cursor-pointer rounded-md border-0 bg-emerald-600 px-3.5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto" type="button" onClick={logout}>Logout</button>
        </div>
      </header>

      {showPasswordForm && <PasswordForm onClose={() => setShowPasswordForm(false)} />}

      {message && <p className="text-red-700">{message}</p>}

      <section className="grid gap-4 rounded-lg border border-gray-300 bg-white p-4 sm:p-5">
        <h2>{data?.store?.name ?? "No store assigned"}</h2>
        <p>Average rating: {data?.averageRating ?? "Not rated"}</p>
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full border-collapse overflow-hidden">
            <thead>
              <tr>
                <th className="border-b border-gray-300 bg-green-100 p-2.5 text-left align-top">Name</th>
                <th className="border-b border-gray-300 bg-green-100 p-2.5 text-left align-top">Email</th>
                <th className="border-b border-gray-300 bg-green-100 p-2.5 text-left align-top">Address</th>
                <th className="border-b border-gray-300 bg-green-100 p-2.5 text-left align-top">Rating</th>
              </tr>
            </thead>
            <tbody>
              {data?.users.map((user) => (
                <tr key={user.id}>
                  <td className="border-b border-gray-300 p-2.5 text-left align-top">{user.name}</td>
                  <td className="border-b border-gray-300 p-2.5 text-left align-top">{user.email}</td>
                  <td className="border-b border-gray-300 p-2.5 text-left align-top">{user.address}</td>
                  <td className="border-b border-gray-300 p-2.5 text-left align-top">{user.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

