import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "COD"
  });

  useEffect(() => {
    api("/cart")
      .then(data => {
        setCart(data);

        if (!data.items.length) {
          navigate("/cart");
        }
      })
      .catch(error => setError(error.message));
  }, []);

  function change(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function placeOrder(e) {
    e.preventDefault();
    setError("");

    try {
      await api("/orders", {
        method: "POST",
        body: JSON.stringify(form)
      });

      navigate("/orders");
    } catch (error) {
      setError(error.message);
    }
  }

  if (!cart) {
    return (
      <div className="container page">
        <p>Loading...</p>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <form className="form-card" onSubmit={placeOrder}>
          <h2>Shipping Details</h2>

          {error && <div className="error">{error}</div>}

          <label>Full Name</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={change}
            required
          />

          <label>Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={change}
            required
          />

          <label>Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={change}
            required
          />

          <label>City</label>
          <input
            name="city"
            value={form.city}
            onChange={change}
            required
          />

          <label>Postal Code</label>
          <input
            name="postalCode"
            value={form.postalCode}
            onChange={change}
            required
          />

          <label>Payment Method</label>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={change}
          >
            <option value="COD">Cash on Delivery</option>
            <option value="ONLINE">Online Payment (demo)</option>
          </select>

          <button className="primary-button full">
            Place Order
          </button>
        </form>

        <aside className="summary-card">
          <h2>Your Order</h2>

          {cart.items.map(item => (
            <div className="summary-row" key={item.product._id}>
              <span>
                {item.product.name} × {item.quantity}
              </span>

              <span>
                ₹
                {(item.product.price * item.quantity).toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>
          ))}

          <hr />

          <div className="summary-row">
            <strong>Total</strong>
            <strong>
              ₹{total.toLocaleString("en-IN")}
            </strong>
          </div>
        </aside>
      </div>
    </div>
  );
}