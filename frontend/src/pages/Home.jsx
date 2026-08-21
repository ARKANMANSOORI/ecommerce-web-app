import React, { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [message, setMessage] = useState("");

  async function loadProducts() {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category !== "All") params.set("category", category);

      const data = await api(`/products?${params.toString()}`);
      setProducts(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [category]);

  async function addToCart(product) {
    if (!user) {
      setMessage("Please login before adding products to the cart.");
      return;
    }

    try {
      await api("/cart", {
        method: "POST",
        body: JSON.stringify({ productId: product._id, quantity: 1 })
      });
      setMessage(`${product.name} added to cart.`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  function submitSearch(event) {
    event.preventDefault();
    loadProducts();
  }

  const categories = ["All", "Electronics", "Fashion", "Home"];

  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">FULL-STACK E-COMMERCE</p>
          <h1>Everything you need, in one simple store.</h1>
          <p>
            Browse products, add them to your cart and place an order.
          </p>
        </div>
      </section>

      <section className="toolbar">
        <form onSubmit={submitSearch} className="search-form">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
          />
          <button className="primary-button">Search</button>
        </form>

        <select value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(item => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </section>

      {message && <div className="notice">{message}</div>}

      <section className="product-grid">
        {products.map(product => (
          <ProductCard
            key={product._id}
            product={product}
            onAdd={addToCart}
          />
        ))}
      </section>

      {products.length === 0 && (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Try another search or category.</p>
        </div>
      )}
    </div>
  );
}