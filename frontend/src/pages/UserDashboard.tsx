import { FormEvent, useEffect, useState } from "react";

import api from "../api";
import PasswordForm from "../components/PasswordForm";
import { useAuth } from "../state/AuthContext";
import { getErrorMessage } from "../utils/errors";

interface StoreRow {
  id: number;
  name: string;
  address: string;
  overallRating: number | null;
  userRating: number | null;
}

export default function UserDashboard() {
  const { logout } = useAuth();
  const [stores, setStores] = useState<StoreRow[]>([]);
  const [search, setSearch] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [message, setMessage] = useState("");

  async function loadStores(clearMessage = true) {
    try {
      const response = await api.get("/stores", { params: { search } });
      setStores(response.data);
      if (clearMessage) {
        setMessage("");
      }
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not load stores."));
    }
  }

  useEffect(() => {
    loadStores();
  }, []);

  async function submitRating(event: FormEvent<HTMLFormElement>, storeId: number) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api.post("/ratings", { storeId, value: Number(form.get("value")) });
      setMessage("Rating saved.");
      await loadStores(false);
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not save rating."));
    }
  }

  return (
    <main className="mx-auto min-h-screen w-[min(1100px,calc(100%-32px))] py-6 text-gray-900 sm:py-8">
      <header className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">Stores</h1>
        <div className="grid gap-2 sm:flex sm:items-center">
          <button className="w-full cursor-pointer rounded-md border-0 bg-emerald-600 px-3.5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto" type="button" onClick={() => setShowPasswordForm((isShown) => !isShown)}>
            Update Password
          </button>
          <button className="w-full cursor-pointer rounded-md border-0 bg-emerald-600 px-3.5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto" type="button" onClick={logout}>Logout</button>
        </div>
      </header>

      {showPasswordForm && <PasswordForm onClose={() => setShowPasswordForm(false)} />}

      {message && <p className={message.includes("saved") ? "text-green-700" : "text-red-700"}>{message}</p>}

      <section className="grid gap-4 rounded-lg border border-gray-300 bg-white p-4 sm:p-5">
        <div className="grid gap-2 sm:flex sm:items-center">
          <input className="w-full min-w-0 flex-1 rounded-md border border-gray-400 bg-white p-2.5" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or address" />
          <button className="w-full cursor-pointer rounded-md border-0 bg-emerald-600 px-3.5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto" type="button" onClick={() => loadStores()}>Search</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full border-collapse overflow-hidden">
            <thead>
              <tr>
                <th className="border-b border-gray-300 bg-green-100 p-2.5 text-left align-top">Name</th>
                <th className="border-b border-gray-300 bg-green-100 p-2.5 text-left align-top">Address</th>
                <th className="border-b border-gray-300 bg-green-100 p-2.5 text-left align-top">Overall Rating</th>
                <th className="border-b border-gray-300 bg-green-100 p-2.5 text-left align-top">Your Rating</th>
                <th className="border-b border-gray-300 bg-green-100 p-2.5 text-left align-top">Submit</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id}>
                  <td className="border-b border-gray-300 p-2.5 text-left align-top">{store.name}</td>
                  <td className="border-b border-gray-300 p-2.5 text-left align-top">{store.address}</td>
                  <td className="border-b border-gray-300 p-2.5 text-left align-top">{store.overallRating ?? "Not rated"}</td>
                  <td className="border-b border-gray-300 p-2.5 text-left align-top">{store.userRating ?? "Not rated"}</td>
                  <td className="border-b border-gray-300 p-2.5 text-left align-top">
                    <form className="flex items-center gap-2" onSubmit={(event) => submitRating(event, store.id)}>
                    <select className="w-18 rounded-md border border-gray-400 bg-white p-2.5" name="value" defaultValue={store.userRating ?? 5}>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <option key={value} value={value}>{value}</option>
                      ))}
                    </select>
                    <button className="cursor-pointer rounded-md border-0 bg-emerald-600 px-3.5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-70" type="submit">Save</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

