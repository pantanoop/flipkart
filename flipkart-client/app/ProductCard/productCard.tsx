"use client";

import "./ProductCard.css";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/hooks/hooks";

interface Product {
  productid: number;
  productname: string;
  price: number;
  rating?: number;
  category?: string;
  subcategory?: string;
  description?: string;
  imageUrls?: string[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const c_user = useAppSelector((state) => state.authenticator.c_user);
  const role = c_user?.role;

  return (
    <div className="product-card">
      <h3>{product.productname}</h3>

      <div
        className="product-images"
        style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}
      >
        {product.imageUrls && product.imageUrls.length > 0 ? (
          product.imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`${product.productname} ${index + 1}`}
              style={{
                width: "70px",
                height: "70px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
          ))
        ) : (
          <p>No images</p>
        )}
      </div>

      <p>${product.price}</p>
      <p>Rating: {product.rating ?? 0} ⭐</p>

      <div
        className="product-buttons"
        style={{ display: "flex", gap: "8px", marginTop: "8px" }}
      >
        <button onClick={() => router.push(`/product/${product.productid}`)}>
          View Details
        </button>

        {role === "admin" && (
          <button
            onClick={() => router.push(`/editproduct/${product.productid}`)}
          >
            Edit Product
          </button>
        )}
      </div>
    </div>
  );
}
