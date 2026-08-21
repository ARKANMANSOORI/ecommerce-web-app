import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { api } from "./api";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [cartCount, setCartCount] = useState(0);

  async function refreshCartCount() {
    if (!localStorage.getItem("token")) {
      setCartCount(0);
      return;
    }

    try {
      const cart = await api("/cart");
      setCartCount(cart.items.reduce((sum, item) => sum + item.quantity, 0));
    } catch {
      setCartCount(0);
    }
  }

  useEffect(() => {
    refreshCartCount();
    const timer = setInterval(refreshCartCount, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Navbar cartCount={cartCount} />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute admin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <footer>
        <div className="container">
          <p>ShopEasy E-Commerce Project</p>
        </div>
      </footer>
    </>
  );
}