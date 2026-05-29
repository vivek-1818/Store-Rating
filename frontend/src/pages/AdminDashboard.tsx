import { FormEvent, useEffect, useState } from "react";

import api from "../api";
import PasswordForm from "../components/PasswordForm";
import { useAuth } from "../state/AuthContext";
import { UserRole } from "../types";
import { getErrorMessage } from "../utils/errors";

interface Stats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  rating: number | null;
}

interface AdminStore {
  id: number;
  name: string;
  email: string;
  address: string;
  rating: number | null;
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stores, setStores] = useState<AdminStore[]>([]);
  const [message, setMessage] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  async function loadAll() {
    const [statsResponse, usersResponse, storesResponse] = await Promise.all([
      api.get("/admin/dashboard"),
      api.get("/admin/users"),
      api.get("/admin/stores"),
    ]);
    setStats(statsResponse.data);
    setUsers(usersResponse.data);
    setStores(storesResponse.data);
  }

  useEffect(() => {
    loadAll().catch((error) =>
      setMessage(getErrorMessage(error, "Could not load dashboard data.")),
    );
  }, []);

  async function createUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      await api.post("/admin/users", Object.fromEntries(form));
      formElement.reset();
      setMessage("User created.");
      try {
        await loadAll();
      } catch {
        setMessage("User created, but dashboard refresh failed.");
      }
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not create user."));
    }
  }

  async function createStore(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      await api.post("/admin/stores", Object.fromEntries(form));
      formElement.reset();
      setMessage("Store created.");
      try {
        await loadAll();
      } catch {
        setMessage("Store created, but dashboard refresh failed.");
      }
    } catch (error) {
      setMessage(
        getErrorMessage(
          error,
          "Could not create store. Owner must be a store owner without a store.",
        ),
      );
    }
  }

  async function filterUsers(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await api.get("/admin/users", { params });
      setUsers(response.data);
      setMessage("");
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not filter users."));
    }
  }

  async function filterStores(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await api.get("/admin/stores", { params });
      setStores(response.data);
      setMessage("");
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not filter stores."));
    }
  }

  return (
    <main className="mx-auto min-h-screen w-[min(1100px,calc(100%-32px))] py-6 text-gray-900 sm:py-8">
      <header className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <div className="grid gap-2 sm:flex sm:items-center">
          <button
            className="w-full cursor-pointer rounded-md border-0 bg-emerald-600 px-3.5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            type="button"
            onClick={() => setShowPasswordForm((isShown) => !isShown)}
          >
            Update Password
          </button>
          <button
            className="w-full cursor-pointer rounded-md border-0 bg-emerald-600 px-3.5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            type="button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      {showPasswordForm && (
        <PasswordForm onClose={() => setShowPasswordForm(false)} />
      )}

      <section className="my-4 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
        <div className="grid gap-1 rounded-lg border border-gray-300 bg-white p-4">
          <strong className="text-3xl">{stats?.totalUsers ?? 0}</strong>
          <span>Users</span>
        </div>
        <div className="grid gap-1 rounded-lg border border-gray-300 bg-white p-4">
          <strong className="text-3xl">{stats?.totalStores ?? 0}</strong>
          <span>Stores</span>
        </div>
        <div className="grid gap-1 rounded-lg border border-gray-300 bg-white p-4">
          <strong className="text-3xl">{stats?.totalRatings ?? 0}</strong>
          <span>Ratings</span>
        </div>
      </section>

      {message && (
        <p
          className={
            message.includes("created") ? "text-green-700" : "text-red-700"
          }
        >
          {message}
        </p>
      )}

      <section className="my-4 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
        <form
          className="grid gap-4 rounded-lg border border-gray-300 bg-white p-4 sm:p-5"
          onSubmit={createUser}
        >
          <h2>Add User</h2>
          <input
            className="w-full rounded-md border border-gray-400 bg-white p-2.5"
            name="name"
            placeholder="Name"
            required
          />
          <input
            className="w-full rounded-md border border-gray-400 bg-white p-2.5"
            type="email"
            name="email"
            placeholder="Email"
            required
          />
          <textarea
            className="min-h-24 w-full resize-y rounded-md border border-gray-400 bg-white p-2.5"
            name="address"
            placeholder="Address"
            required
          />
          <input
            className="w-full rounded-md border border-gray-400 bg-white p-2.5"
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <select
            className="w-full rounded-md border border-gray-400 bg-white p-2.5"
            name="role"
            defaultValue="USER"
          >
            <option value="USER">Normal User</option>
            <option value="ADMIN">Admin</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
          <button
            className="cursor-pointer rounded-md border-0 bg-emerald-600 px-3.5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
          >
            Create user
          </button>
        </form>

        <form
          className="grid gap-4 rounded-lg border border-gray-300 bg-white p-4 sm:p-5"
          onSubmit={createStore}
        >
          <h2>Add Store</h2>
          <input
            className="w-full rounded-md border border-gray-400 bg-white p-2.5"
            name="name"
            placeholder="Store name"
            required
          />
          <input
            className="w-full rounded-md border border-gray-400 bg-white p-2.5"
            type="email"
            name="email"
            placeholder="Store email"
            required
          />
          <textarea
            className="min-h-24 w-full resize-y rounded-md border border-gray-400 bg-white p-2.5"
            name="address"
            placeholder="Address"
            required
          />
          <input
            className="w-full rounded-md border border-gray-400 bg-white p-2.5"
            type="number"
            name="ownerId"
            placeholder="Store owner user id"
            required
          />
          <button
            className="cursor-pointer rounded-md border-0 bg-emerald-600 px-3.5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
          >
            Create store
          </button>
        </form>
      </section>

      <section className="grid gap-4 rounded-lg border border-gray-300 bg-white p-4 sm:p-5">
        <h2>Users</h2>
        <form
          className="grid gap-2 sm:flex sm:flex-wrap sm:items-center"
          onSubmit={filterUsers}
        >
          <input
            className="w-full min-w-0 flex-1 rounded-md border border-gray-400 bg-white p-2.5 sm:min-w-36"
            name="name"
            placeholder="Name"
          />
          <input
            className="w-full min-w-0 flex-1 rounded-md border border-gray-400 bg-white p-2.5 sm:min-w-36"
            name="email"
            placeholder="Email"
          />
          <input
            className="w-full min-w-0 flex-1 rounded-md border border-gray-400 bg-white p-2.5 sm:min-w-36"
            name="address"
            placeholder="Address"
          />
          <select
            className="w-full min-w-0 flex-1 rounded-md border border-gray-400 bg-white p-2.5 sm:min-w-36"
            name="role"
            defaultValue=""
          >
            <option value="">All roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
          <select
            className="w-full min-w-0 flex-1 rounded-md border border-gray-400 bg-white p-2.5 sm:min-w-36"
            name="sortBy"
            defaultValue="name"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="address">Address</option>
            <option value="role">Role</option>
          </select>
          <select
            className="w-full min-w-0 flex-1 rounded-md border border-gray-400 bg-white p-2.5 sm:min-w-36"
            name="order"
            defaultValue="asc"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
          <button
            className="w-full cursor-pointer rounded-md border-0 bg-emerald-600 px-3.5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            type="submit"
          >
            Apply
          </button>
        </form>
        <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse overflow-hidden">
          <thead>
            <tr>
              <th className="border-b border-gray-300 bg-green-100 p-2.5 text-left align-top">
                ID
              </th>
              <th className="border-b border-gray-300 bg-green-100 p-2.5 text-left align-top">
                Name
              </th>
              <th className="border-b border-gray-300 bg-green-100 p-2.5 text-left align-top">
                Email
              </th>
              <th className="border-b border-gray-300 bg-green-100 p-2.5 text-left align-top">
                Address
              </th>
              <th className="border-b border-gray-300 bg-green-100 p-2.5 text-left align-top">
                Role
              </th>
              <th className="border-b border-gray-300 bg-green-100 p-2.5 text-left align-top">
                Owner Rating
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border-b border-gray-300 p-2.5 text-left align-top">
                  {user.id}
                </td>
                <td className="border-b border-gray-300 p-2.5 text-left align-top">
                  {user.name}
                </td>
                <td className="border-b border-gray-300 p-2.5 text-left align-top">
                  {user.email}
                </td>
                <td className="border-b border-gray-300 p-2.5 text-left align-top">
                  {user.address}
                </td>
                <td className="border-b border-gray-300 p-2.5 text-left align-top">
                  {user.role}
                </td>
                <td className="border-b border-gray-300 p-2.5 text-left align-top">
                  {user.rating ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>

      <section className="mt-4 grid gap-4 rounded-lg border border-gray-300 bg-white p-4 sm:p-5">
        <h2>Stores</h2>
        <form
          className="grid gap-2 sm:flex sm:flex-wrap sm:items-center"
          onSubmit={filterStores}
        >
          <input
            className="w-full min-w-0 flex-1 rounded-md border border-gray-400 bg-white p-2.5 sm:min-w-36"
            name="name"
            placeholder="Name"
          />
          <input
            className="w-full min-w-0 flex-1 rounded-md border border-gray-400 bg-white p-2.5 sm:min-w-36"
            name="email"
            placeholder="Email"
          />
          <input
            className="w-full min-w-0 flex-1 rounded-md border border-gray-400 bg-white p-2.5 sm:min-w-36"
            name="address"
            placeholder="Address"
          />
          <select
            className="w-full min-w-0 flex-1 rounded-md border border-gray-400 bg-white p-2.5 sm:min-w-36"
            name="sortBy"
            defaultValue="name"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="address">Address</option>
            <option value="rating">Rating</option>
          </select>
          <select
            className="w-full min-w-0 flex-1 rounded-md border border-gray-400 bg-white p-2.5 sm:min-w-36"
            name="order"
            defaultValue="asc"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
          <button
            className="w-full cursor-pointer rounded-md border-0 bg-emerald-600 px-3.5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            type="submit"
          >
            Apply
          </button>
        </form>
        <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full border-collapse overflow-hidden">
          <thead>
            <tr>
              <th className="border-b border-gray-300 bg-green-100 p-2.5 text-left align-top">
                Name
              </th>
              <th className="border-b border-gray-300 bg-green-100 p-2.5 text-left align-top">
                Email
              </th>
              <th className="border-b border-gray-300 bg-green-100 p-2.5 text-left align-top">
                Address
              </th>
              <th className="border-b border-gray-300 bg-green-100 p-2.5 text-left align-top">
                Rating
              </th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td className="border-b border-gray-300 p-2.5 text-left align-top">
                  {store.name}
                </td>
                <td className="border-b border-gray-300 p-2.5 text-left align-top">
                  {store.email}
                </td>
                <td className="border-b border-gray-300 p-2.5 text-left align-top">
                  {store.address}
                </td>
                <td className="border-b border-gray-300 p-2.5 text-left align-top">
                  {store.rating ?? "-"}
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

