import { useState } from "react";
import api, { getErrorMessage } from "../api/axios.js";
import { useAuth } from "../context/useAuth.js";
import { useToast } from "../context/useToast.js";
import Alert from "../components/ui/Alert.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export default function Profile() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setServerError("");
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
      toast("Profile updated");
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My profile</h1>
        <p className="mt-1 text-sm text-slate-600">Update your name and email.</p>
      </div>

      <Card>
        <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-700">
            {initials(user.name)}
          </div>
          <div>
            <p className="font-semibold">{user.name}</p>
            <div className="mt-1">
              <Badge variant={user.role}>{user.role}</Badge>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {serverError && <Alert type="error">{serverError}</Alert>}
          <Input
            label="Name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <div className="flex justify-end">
            <Button type="submit" loading={submitting}>
              {submitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
