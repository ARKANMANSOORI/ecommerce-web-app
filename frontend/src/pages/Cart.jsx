import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function loadCart() {
    try {
      setCart(await api("/cart"));
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function update(productId, quantity) {
    try {
      const data = await api(`/cart/${productId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity })
      });

      setCart(data);
    } catch (error) {
      setError(error.message);
    }
  }

  async function remove(productId) {
    try {
      const data = await api(`/cart/${productId}`, {
        method: "DELETE"
      });

      setCart(data);
    } catch (error) {
      setError(error.message);
    }
  }

  if (!cart) {
    return (
      <div className="container page">
        <p>{error || "Loading..."}</p>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="page">
      <h1>Your Cart</h1>

      {error && <div className="error">{error}</div>}

      {cart.items.length === 0 ? (
        <div className="empty-state">
          <h2>Your cart is empty</h2>

          <Link to="/" className="primary-button">
            Shop Products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            {cart.items.map(item => (
              <div className="cart-item" key={item.product._id}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                />

                <div className="cart-item-main">
                  <h3>{item.product.name}</h3>

                  <p>
                    ₹{item.product.price.toLocaleString("en-IN")} each
                  </p>

                  <div className="quantity">
                    <button
                      onClick={() =>
                        item.quantity > 1 &&
                        update(
                          item.product._id,
                          item.quantity - 1
                        )
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        update(
                          item.product._id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <strong>
                  ₹
                  {(item.product.price * item.quantity).toLocaleString(
                    "en-IN"
                  )}
                </strong>

                <button
                  className="danger-link"
                  onClick={() => remove(item.product._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <aside className="summary-card">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Total</span>

              <strong>
                ₹{total.toLocaleString("en-IN")}
              </strong>
            </div>

            <button
              className="primary-button full"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}