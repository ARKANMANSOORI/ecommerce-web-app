import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/orders/my")
      .then(setOrders)
      .catch(error => setError(error.message));
  }, []);

  return (
    <div className="page">
      <h1>My Orders</h1>

      {error && <div className="error">{error}</div>}

      {orders.length === 0 ? (
        <div className="empty-state">
          <h2>No orders yet</h2>
          <p>Place your first order from the product catalog.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <article className="order-card" key={order._id}>
              <div className="order-head">
                <div>
                  <strong>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </strong>
                  <p>{new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <span
                  className={`status status-${order.status.toLowerCase()}`}
                >
                  {order.status}
                </span>
              </div>

              {order.items.map(item => (
                <div className="summary-row" key={item.product}>
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}

              <hr />

              <div className="summary-row">
                <strong>Total</strong>
                <strong>
                  ₹{order.totalAmount.toLocaleString("en-IN")}
                </strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}