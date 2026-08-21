import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} />

      <div className="product-card-body">
        <span className="category">{product.category}</span>

        <h3>{product.name}</h3>

        <p className="description">{product.description}</p>

        <div className="product-bottom">
          <strong>
            ₹{product.price.toLocaleString("en-IN")}
          </strong>

          <span>
            {product.stock > 0
              ? `${product.stock} left`
              : "Out of stock"}
          </span>
        </div>

        <div className="card-actions">
          <Link
            to={`/products/${product._id}`}
            className="secondary-button"
          >
            Details
          </Link>

          <button
            className="primary-button"
            disabled={product.stock === 0}
            onClick={() => onAdd(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}