import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api(`/products/${id}`)
      .then(setProduct)
      .catch(error => setMessage(error.message));
  }, [id]);

  async function addToCart() {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await api("/cart", {
        method: "POST",
        body: JSON.stringify({ productId: product._id, quantity: 1 })
      });
      setMessage("Product added to cart.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (!product) {
    return <div className="container page"><p>{message || "Loading..."}</p></div>;
  }

  return (
    <div className="page">
      <div className="detail-card">
        <img src={product.image} alt={product.name} />

        <div>
          <span className="category">{product.category}</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <h2>₹{product.price.toLocaleString("en-IN")}</h2>
          <p>Available stock: {product.stock}</p>

          {message && <div className="notice">{message}</div>}

          <button
            className="primary-button"
            disabled={product.stock === 0}
            onClick={addToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
