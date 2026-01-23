"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { fetchProductById } from "../../../app/redux/productSlice";

import { Typography, Card, CardMedia, CardContent, Box } from "@mui/material";

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const product = useAppSelector((state) => state.productor.selectedProduct);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number(id)));
    }
  }, [id, dispatch]);

  if (!product) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Card sx={{ maxWidth: 500, p: 2 }}>
        {product.photoUrl && (
          <CardMedia
            component="img"
            height="300"
            image={product.photoUrl}
            alt={product.productname}
          />
        )}
        <CardContent>
          <Typography variant="h5">{product.productname}</Typography>
          <Typography variant="subtitle1">Price: ${product.price}</Typography>
          <Typography variant="subtitle2">
            Rating: {product.rating ?? 0} ⭐
          </Typography>
          <Typography variant="body2" mt={1}>
            Category: {product.category} / {product.subcategory}
          </Typography>
          <Typography variant="body2" mt={1}>
            Seller ID: {product.sellerid}
          </Typography>
          {product.description && (
            <Typography variant="body2" mt={2}>
              {product.description}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
