"use client";

// import "./ProductCard.css";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/hooks/hooks";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

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
  console.log(product);

  return (
    <div className="product-card">
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Card sx={{ maxWidth: 500, p: 2, minHeight: 450, maxHeight: 450 }}>
          <div
            className="product-images"
            style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}
          >
            {product.imageUrls && product.imageUrls.length > 0 ? (
              <img
                key={product.productid}
                src={product?.imageUrls[0]}
                alt={`${product.productname} `}
                // ${index + 1}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
            ) : (
              <p>No images</p>
            )}
          </div>

          <CardContent>
            <Typography sx={{ mt: 3 }} variant="h5">
              {product.productname}
            </Typography>
            <Typography sx={{ mt: 1, fontWeight: "20px" }} variant="subtitle1">
              Price: ${product.price}
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>
              Rating: {product.rating ?? 0} ⭐
            </Typography>
          </CardContent>

          <div
            className="product-buttons"
            style={{
              display: "flex",
              gap: "88px",
              marginTop: "8px",
              marginRight: "5px",
            }}
          >
            <Button
              sx={{ ml: "6" }}
              onClick={() => router.push(`/product/${product.productid}`)}
            >
              View Details
            </Button>

            {role === "customer" && (
              <Button onClick={() => router.push(`/dashboards`)}>
                Add Cart
              </Button>
            )}

            {role === "admin" && (
              <Button
                sx={{}}
                onClick={() => router.push(`/editproduct/${product.productid}`)}
              >
                Edit Product
              </Button>
            )}
          </div>
        </Card>
      </Box>
    </div>
  );
}
