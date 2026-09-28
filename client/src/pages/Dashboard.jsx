import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getErrorMessage } from "../api/axios.js";
import { useAuth } from "../context/useAuth.js";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "-";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const isAdmin = user.role === "admin";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(isAdmin);
  const [error, setError] = useState("");

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

  const handleDelete = async (target) => {
    const isSelf = target.id === user.id;
    const message = isSelf
      ? "Delete your own account? This cannot be undone."
      : `Delete ${target.name}? This cannot be undone.`;
    if (!window.confirm(message)) return;

    setError("");
    try {
      await api.delete(`/users/${target.id}`);
      if (isSelf) logout();
      else setUsers((prev) => prev.filter((u) => u.id !== target.id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="panel">
        <h1>Welcome, {user.name}</h1>
        <p>Email: {user.email}</p>
        <p>
          Role: <span className={`badge ${user.role}`}>{user.role}</span>
        </p>
        <p>Member since: {formatDate(user.createdAt)}</p>
      </div>

      <div className="panel">
        <h2>{isAdmin ? "All users" : "Your account"}</h2>
        {error && <div className="alert">{error}</div>}
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => {
                  const isSelf = u.id === user.id;
                  return (
                    <tr key={u.id}>
                      <td>
                        {u.name}
                        {isSelf && <span className="tag">You</span>}
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role}`}>{u.role}</span>
                      </td>
                      <td>{formatDate(u.createdAt)}</td>
                      <td className="actions">
                        {isSelf && <Link to="/profile">Edit</Link>}
                        <button className="danger" onClick={() => handleDelete(u)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
