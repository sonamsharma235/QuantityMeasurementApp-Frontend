import { useState } from "react";
import FloatingInput from "../components/FloatingInput";
import { signup } from "../services/authService";
import "../styles/auth.css";

export default function Signup({ goLogin, onLogin }) {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [err,      setErr]      = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErr("");

  try {
    const data = await signup({
  userName: name,
  email,
  password
});

    localStorage.setItem("token", data.token);

    onLogin({
  name: data.name,
  email: data.email
});
  } catch (err) {
    setErr(err.response?.data?.message || "Signup failed");
  }
};

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob--top" />
      <div className="auth-blob auth-blob--bottom" />

      <div className="auth-card">
        <h2>Create Account 🚀</h2>
        <p className="subtitle">Join us today</p>

        <form onSubmit={handleSubmit}>
          <FloatingInput
            id="name"
            type="text"
            label="Full Name"
            value={name}
            onChange={e => { setName(e.target.value); setErr(""); }}
          />
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

          <button type="submit" className="btn-signup">Sign Up</button>
        </form>

        <p className="switch">
          Already have an account?{" "}
          <span onClick={goLogin}>Login</span>
        </p>
      </div>
    </div>
  );
}
