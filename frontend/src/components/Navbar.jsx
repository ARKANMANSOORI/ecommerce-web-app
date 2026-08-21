import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ cartCount = 0 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">ShopEasy</Link>

        <nav>
          <Link to="/">Products</Link>

          {user && <Link to="/cart">Cart ({cartCount})</Link>}
          {user && <Link to="/orders">My Orders</Link>}

          {user?.role === "admin" && (
            <Link to="/admin">Admin</Link>
          )}

          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="nav-button">Register</Link>
            </>
          ) : (
            <button className="link-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}