import React, { useEffect, useState } from "react";
import { api } from "../api";

const blank = {
  name: "",
  description: "",
  price: "",
  category: "Electronics",
  image: "",
  stock: ""
};

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const [productData, orderData] = await Promise.all([
        api("/products"),
        api("/orders")
      ]);
      setProducts(productData);
      setOrders(orderData);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function edit(product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(blank);
  }

  async function saveProduct(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock)
      };

      if (editingId) {
        await api(`/products/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        setMessage("Product updated.");
      } else {
        await api("/products", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        setMessage("Product created.");
      }

      resetForm();
      await load();
    } catch (error) {
      setError(error.message);
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api(`/products/${id}`, { method: "DELETE" });
      setMessage("Product deleted.");
      await load();
    } catch (error) {
      setError(error.message);
    }
  }

  async function updateStatus(id, status) {
    try {
      await api(`/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status })
      });
      setMessage("Order status updated.");
      await load();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>

      {message && <div className="notice">{message}</div>}
      {error && <div className="error">{error}</div>}

      <section className="admin-grid">
        <form className="form-card" onSubmit={saveProduct}>
          <h2>{editingId ? "Edit Product" : "Add Product"}</h2>

          <label>Name</label>
          <input name="name" value={form.name} onChange={change} required />

          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={change}
            required
          />

          <label>Price</label>
          <input
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={change}
            required
          />

          <label>Category</label>
          <select name="category" value={form.category} onChange={change}>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home</option>
            <option>Other</option>
          </select>

          <label>Image URL</label>
          <input
            name="image"
            value={form.image}
            onChange={change}
            placeholder="https://..."
          />

          <label>Stock</label>
          <input
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={change}
            required
          />

          <div className="button-row">
            <button className="primary-button">
              {editingId ? "Update Product" : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <section>
          <h2>Products</h2>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>₹{product.price.toLocaleString("en-IN")}</td>
                    <td>{product.stock}</td>

                    <td>
                      <button
                        className="small-button"
                        onClick={() => edit(product)}
                      >
                        Edit
                      </button>

                      <button
                        className="small-button danger"
                        onClick={() => remove(product._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <section className="admin-orders">
        <h2>All Orders</h2>

        {orders.map(order => (
          <article className="order-card" key={order._id}>
            <div className="order-head">
              <div>
                <strong>#{order._id.slice(-8).toUpperCase()}</strong>
                <p>
                  {order.user?.name} — {order.user?.email}
                </p>
              </div>

              <select
                value={order.status}
                onChange={e =>
                  updateStatus(order._id, e.target.value)
                }
              >
                <option>Placed</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
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

            <div className="summary-row">
              <strong>Total</strong>
              <strong>
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </strong>
            </div>
          </article>
        ))}

        {orders.length === 0 && <p>No orders yet.</p>}
      </section>
    </div>
  );
}