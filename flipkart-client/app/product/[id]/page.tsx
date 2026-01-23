"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { fetchProductById } from "../../../app/redux/productSlice";
import NextLink from "next/link";

import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
  Button,
} from "@mui/material";

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
    <>
      <div>
        <NextLink href="/dashboard">
          <Button variant="outlined">Dashboard</Button>
        </NextLink>
      </div>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Card sx={{ minWidth: 500, p: 2 }}>
          <div
            className="product-images"
            style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}
          >
            {product.imageUrls && product.imageUrls.length > 0 ? (
              product.imageUrls.map((url: any, index: any) => (
                <CardMedia
                  key={index}
                  component="img"
                  height="300"
                  image={url}
                  alt={product.productname}
                />
              ))
            ) : (
              <p>No images</p>
            )}
          </div>

          {/* <img
              key={index}
              src={url}
              alt={`${product.productname} ${index + 1}`}
              style={{
                width: "70px",
                height: "70px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            /> */}
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
            <Typography variant="body2" sx={{ mt: 3 }}>
              Category: {product.category} / {product.subcategory}
            </Typography>
            <Typography variant="body2" sx={{ mt: 3 }}>
              Seller ID: {product.sellerid}
            </Typography>
            {product.description && (
              <Typography variant="body2" sx={{ mt: 3 }}>
                {product.description}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
