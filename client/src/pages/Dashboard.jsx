import { useEffect, useState } from "react";
import { CalendarDays, Pencil, ShieldCheck, Trash2, UserRound, Users } from "lucide-react";
import api, { getErrorMessage } from "../api/axios.js";
import { useAuth } from "../context/useAuth.js";
import Alert from "../components/ui/Alert.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import ConfirmModal from "../components/ui/ConfirmModal.jsx";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

const initials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card className="flex items-center gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-xl font-semibold capitalize">{value}</p>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const isAdmin = user.role === "admin";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(isAdmin);
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;

    api
      .get("/users")
      .then((res) => {
        if (!cancelled) setUsers(res.data.users);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  const rows = isAdmin ? users : [user];

  const confirmDelete = async () => {
    const target = toDelete;
    setDeleting(true);
    setError("");
    try {
      await api.delete(`/users/${target.id}`);
      setToDelete(null);
      if (target.id === user.id) logout();
      else setUsers((prev) => prev.filter((u) => u.id !== target.id));
    } catch (err) {
      setToDelete(null);
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const deletingSelf = toDelete && toDelete.id === user.id;
  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome, {user.name}</h1>
        <p className="mt-1 text-sm text-slate-600">{user.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {isAdmin ? (
          <>
            <StatCard icon={Users} label="Total users" value={loading ? "-" : users.length} />
            <StatCard icon={ShieldCheck} label="Admins" value={loading ? "-" : adminCount} />
            <StatCard
              icon={UserRound}
              label="Regular users"
              value={loading ? "-" : users.length - adminCount}
            />
          </>
        ) : (
          <>
            <StatCard icon={ShieldCheck} label="Your role" value={user.role} />
            <StatCard icon={CalendarDays} label="Member since" value={formatDate(user.createdAt)} />
          </>
        )}
      </div>

      <Card className="p-0">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold">{isAdmin ? "All users" : "Your account"}</h2>
        </div>

        {error && (
          <div className="px-6 pt-4">
            <Alert type="error">{error}</Alert>
          </div>
        )}

        {loading ? (
          <div className="space-y-3 p-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((u) => {
                  const isSelf = u.id === user.id;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                            {initials(u.name)}
                          </div>
                          <div>
                            <p className="font-medium">
                              {u.name}
                              {isSelf && (
                                <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={u.role}>{u.role}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {isSelf && (
                            <Button to="/profile" variant="secondary" size="sm">
                              <Pencil className="h-4 w-4" />
                              Edit
                            </Button>
                          )}
                          <Button variant="danger" size="sm" onClick={() => setToDelete(u)}>
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmModal
        open={Boolean(toDelete)}
        title={deletingSelf ? "Delete your account?" : "Delete user?"}
        message={
          deletingSelf
            ? "Your account will be removed and you will be logged out. This cannot be undone."
            : toDelete
              ? `${toDelete.name} will be removed. This cannot be undone.`
              : ""
        }
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
