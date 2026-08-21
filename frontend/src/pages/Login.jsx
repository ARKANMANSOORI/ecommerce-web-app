import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("User@123");
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");

    try {
      const user = await login(email, password);
      const target =
        location.state?.from ||
        (user.role === "admin" ? "/admin" : "/");

      navigate(target);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="auth-page">
      <form className="form-card" onSubmit={submit}>
        <h1>Login</h1>
        <p>Use your customer or admin account.</p>

        {error && <div className="error">{error}</div>}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button className="primary-button full">Login</button>

        <div className="demo-box">
          <strong>Demo accounts</strong>
          <br />
          Customer: user@example.com / User@123
          <br />
          Admin: admin@example.com / Admin@123
        </div>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}