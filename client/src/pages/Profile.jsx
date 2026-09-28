import { useState } from "react";
import api, { getErrorMessage } from "../api/axios.js";
import { useAuth } from "../context/useAuth.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setSuccess("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const found = {};
    if (form.name.trim().length < 2) found.name = "Name must be at least 2 characters";
    if (!EMAIL_RE.test(form.email.trim())) found.email = "Enter a valid email";
    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccess("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    const payload = {};
    if (form.name.trim() !== user.name) payload.name = form.name.trim();
    if (form.email.trim() !== user.email) payload.email = form.email.trim();

    if (!Object.keys(payload).length) {
      setServerError("No changes to save");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.put("/users/profile", payload);
      setUser(data.user);
      setForm({ name: data.user.name, email: data.user.email });
      setSuccess("Profile updated");
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h1>My profile</h1>
      {serverError && <div className="alert">{serverError}</div>}
      {success && <div className="success">{success}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
