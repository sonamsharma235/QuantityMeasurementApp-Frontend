import { useState, useEffect } from "react";
import API from "./services/api";

import Login     from "./pages/Login";
import Signup    from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

import "./styles/global.css";

export default function App() {

  const [page, setPage] = useState(null);
  const [user, setUser] = useState(null);

  // 🔥 STEP 1: Check token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      API.get("/users/me")
        .then(res => {
          setUser(res.data);
          setPage("dashboard");
        })
        .catch(() => {
          localStorage.removeItem("token");
          setPage("login");
        });
        
    }else{
          setPage("login");
        }
  }, []);

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    localStorage.setItem("token", token);

    API.get("/users/me").then(res => {
      setUser(res.data);
      setPage("dashboard"); // ✅ directly go dashboard
    });

    window.history.replaceState({}, document.title, "/");
  }
}, []);

  const handleLogin  = (u) => {
    setUser(u);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setPage("login");
  };

  if (page === "dashboard" && user)
    return <Dashboard user={user} onLogout={handleLogout} />;

  if (page === "signup")
    return <Signup goLogin={() => setPage("login")} onLogin={handleLogin} />;

  return <Login goSignup={() => setPage("signup")} onLogin={handleLogin} />;
}