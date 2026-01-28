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
  IconButton,
} from "@mui/material";
import {
  addToCart,
  addToWishlist,
  removeFromWishlist,
} from "../redux/productSlice";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";

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
  const currentuser = useAppSelector((state) => state.authenticator.c_user);
  const wishlist = useAppSelector((state) => state.productor.wishlist);

  const isWishlisted = wishlist?.some(
    (item: any) => item.productid === product.productid,
  );

  const handleAddToCart = () => {
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

  const handleAddToWishlist = () => {
    if (isWishlisted) return;
    console.log("hitted add to wishlist");
    dispatch(
      addToWishlist({
        productid: product.productid,
        userid: currentuser.userid,
      }),
    );
  };
  const handleRemoveFromWishlist = () => {
    console.log("hitted remove to wishlist");

    dispatch(
      removeFromWishlist({
        productid: product.productid,
        userid: currentuser.userid,
      }),
    );
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      <Card
        sx={{
          width: "100%",
          maxWidth: 340,
          minHeight: 480,
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
            height: { xs: 220, sm: 250 },
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
                left: 8,
                zIndex: 2,
                fontWeight: "bold",
              }}
            />
          )}
          {role === "customer" && !product.isBanned && (
            <IconButton
              onClick={() => {
                if (isWishlisted) {
                  handleRemoveFromWishlist();
                } else {
                  handleAddToWishlist();
                }
              }}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 2,
                backgroundColor: "white",
                "&:hover": { backgroundColor: "#ffe6ee" },
              }}
            >
              {isWishlisted ? (
                <FavoriteIcon sx={{ color: "#e91e63" }} />
              ) : (
                <FavoriteBorderOutlinedIcon sx={{ color: "#e91e63" }} />
              )}
            </IconButton>
          )}

          {product.imageUrls?.length ? (
            <Box
              component="img"
              src={product.imageUrls[0]}
              alt={product.productname}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
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
          <Typography sx={{ mt: 0.5, fontWeight: 500 }}>
            $ {product.price}
          </Typography>
          <Typography sx={{ mt: 0.5 }}>⭐ {product.rating ?? 0}</Typography>
        </CardContent>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1,
            p: 2,
          }}
        >
          <Button
            variant="contained"
            fullWidth
            onClick={() => router.push(`/product/${product.productid}`)}
          >
            View
          </Button>

          {role === "customer" && !product.isBanned && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          )}

          {(role === "admin" || role === "seller") && (
            <>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={() => handleDelete?.(product.productid)}
              >
                Delete
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => router.push(`/editproduct/${product.productid}`)}
              >
                Edit
              </Button>
            </>
          )}
        </Box>

        {role === "admin" && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Button
              variant="outlined"
              color="success"
              fullWidth
              onClick={() => handleBan?.(product.productid)}
            >
              {product.isBanned ? "Unban" : "Ban"}
            </Button>
          </Box>
        )}
      </Card>
    </Box>
  );
}
