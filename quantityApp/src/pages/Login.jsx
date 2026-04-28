import { useState } from "react";
import FloatingInput from "../components/FloatingInput";
import { login } from "../services/authService";
import { getMe } from "../services/authService";
import "../styles/auth.css";

export default function Login({ goSignup, onLogin }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [err,      setErr]      = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErr("");

  try {
    const data = await login({ email, password });

    localStorage.setItem("token", data.token);

    const user = await getMe();

onLogin(user);
  } catch (err) {
    setErr(err.response?.data?.message || "Invalid credentials");
  }
};

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob--top" />
      <div className="auth-blob auth-blob--bottom" />

      <div className="auth-card">
        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Login to your account</p>

        <form onSubmit={handleSubmit}>
          <FloatingInput
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErr(""); }}
          />
          <FloatingInput
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={e => { setPassword(e.target.value); setErr(""); }}
          />

          {err && <p className="auth-error">{err}</p>}

          <button type="submit" className="btn-login">Login</button>
        </form>

        <p className="switch">
          Don't have an account?{" "}
          <span onClick={goSignup}>Sign up</span>
        </p>
        <button
          type="button"
          className="btn-google"
          onClick={() => {
          window.location.href = "http://localhost:8086/oauth2/authorization/google";
         }}
>
  Continue with Google
</button>
      </div>
    </div>
  );
}
