import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { getErrorMessage } from "../api/axios.js";
import AuthLayout from "../components/AuthLayout.jsx";
import Alert from "../components/ui/Alert.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import PasswordInput from "../components/ui/PasswordInput.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const found = {};
    if (form.name.trim().length < 2) found.name = "Name must be at least 2 characters";
    if (!EMAIL_RE.test(form.email.trim())) found.email = "Enter a valid email";
    if (form.password.length < 8) found.password = "Password must be at least 8 characters";
    else if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password))
      found.password = "Password needs a letter and a number";
    if (form.confirm !== form.password) found.confirm = "Passwords do not match";
    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      await signup(form.name.trim(), form.email.trim(), form.password);
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Sign up to get started."
      footer={
        <>
          Have an account?{" "}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {serverError && <Alert type="error">{serverError}</Alert>}
        <Input
          label="Name"
          name="name"
          autoComplete="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <PasswordInput
          label="Password"
          name="password"
          autoComplete="new-password"
          placeholder="8+ characters, letter and number"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <PasswordInput
          label="Confirm password"
          name="confirm"
          autoComplete="new-password"
          placeholder="Repeat password"
          value={form.confirm}
          onChange={handleChange}
          error={errors.confirm}
        />
        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? "Creating account..." : "Sign up"}
        </Button>
      </form>
    </AuthLayout>
  );
}
