"use client";

import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/app/hooks/hooks";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
} from "@mui/material";
import { addToCart } from "../redux/productSlice";

interface Product {
  productid: number;
  productname: string;
  price: number;
  rating?: number;
  imageUrls?: string[];
  isBanned?: boolean;
}

interface ProductCardProps {
  product: Product;
  handleDelete?: (id: number) => void;
  handleBan?: (id: number) => void;
}

export default function ProductCard({
  product,
  handleDelete,
  handleBan,
}: ProductCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const role = useAppSelector((state) => state.authenticator.c_user?.role);

  const handleAddToCart = () => {
    console.log("handle cart clicked");
    dispatch(
      addToCart({
        id: product.productid,
        productName: product.productname,
        price: product.price,
        image: product.imageUrls?.[0] || "",
        quantity: 1,
      }),
    );
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Card
        sx={{
          width: 320,
          height: 500,
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 3,
          border: product.isBanned ? "2px solid green" : "none",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: 8,
            transform: "translateY(-6px)",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            height: 260,
            overflow: "hidden",
            backgroundColor: "#f5f5f5",
          }}
        >
          {product.isBanned && (
            <Chip
              label="BANNED"
              color="success"
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 2,
                fontWeight: "bold",
              }}
            />
          )}

          {product.imageUrls?.length ? (
            <Box
              component="img"
              src={product.imageUrls[0]}
              alt={product.productname}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.4s ease",
                "&:hover": {
                  transform: "scale(1.08)",
                },
              }}
            />
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "gray",
              }}
            >
              No Image
            </Box>
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" noWrap fontWeight={600}>
            {product.productname}
          </Typography>
          <Typography sx={{ mt: 0.5 }}>$ {product.price}</Typography>
          <Typography sx={{ mt: 0.5 }}>⭐ {product.rating ?? 0}</Typography>
        </CardContent>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            p: 2,
            justifyContent: "space-between",
          }}
        >
          <Button
            size="small"
            variant="contained"
            sx={{ minWidth: 90 }}
            onClick={() => router.push(`/product/${product.productid}`)}
          >
            View
          </Button>

          {role === "customer" && !product.isBanned && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              sx={{ minWidth: 110 }}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          )}

          {(role === "admin" || role === "seller") && (
            <>
              <Button
                size="small"
                variant="contained"
                color="error"
                sx={{ minWidth: 90 }}
                onClick={() => handleDelete?.(product.productid)}
              >
                Delete
              </Button>

              <Button
                size="small"
                variant="outlined"
                sx={{ minWidth: 80 }}
                onClick={() => router.push(`/editproduct/${product.productid}`)}
              >
                Edit
              </Button>
            </>
          )}

          {role === "admin" && (
            <Button
              size="small"
              variant="outlined"
              color="success"
              fullWidth
              onClick={() => handleBan?.(product.productid)}
            >
              {product.isBanned ? "Unban" : "Ban"}
            </Button>
          )}
        </Box>
      </Card>
    </Box>
  );
}
