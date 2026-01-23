"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { fetchProductById, updateProduct } from "../../redux/productSlice";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  Snackbar,
  Alert,
} from "@mui/material";

const ProductSchema = z.object({
  productname: z.string().min(1),
  category: z.string().min(1),
  subcategory: z.string().min(1),
  price: z.string().min(1),
  description: z.string().optional(),
  photoUrl: z.string().optional(),
});

export default function EditProduct() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const productId = Number(searchParams.get("id"));

  const product = useAppSelector((state) => state.productor.selectedProduct);
  const c_user = useAppSelector((state) => state.authenticator.c_user);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ProductSchema),
  });

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(Number(productId)));
    }
  }, [productId, dispatch]);

  useEffect(() => {
    if (product) {
      reset({
        productname: product.productname,
        category: product.category,
        subcategory: product.subcategory,
        price: String(product.price),
        description: product.description,
        photoUrl: product.photoUrl,
      });
    }
  }, [product, reset]);

  const handleUpdateProduct = (data: any) => {
    dispatch(
      updateProduct({
        id: Number(productId),
        data: {
          productname: data.productname,
          category: data.category,
          subcategory: data.subcategory,
          price: Number(data.price),
          description: data.description,
          photoUrl: data.photoUrl,
          sellerid: Number(c_user?.uid),
        },
      }),
    );

    setOpenSnackbar(true);

    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <>
      <Card variant="outlined" sx={{ p: 4, minWidth: 380 }}>
        <Typography variant="h5" textAlign="center" mb={2}>
          Edit Product
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField label="Product ID" value={productId} disabled fullWidth />
          <TextField label="Seller ID" value={c_user?.uid} disabled fullWidth />
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(handleUpdateProduct)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Controller
            name="productname"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Product Name"
                error={!!errors.productname}
                helperText={errors.productname?.message}
              />
            )}
          />

          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Category"
                error={!!errors.category}
                helperText={errors.category?.message}
              />
            )}
          />

          <Controller
            name="subcategory"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Subcategory"
                error={!!errors.subcategory}
                helperText={errors.subcategory?.message}
              />
            )}
          />

          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Price"
                type="number"
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Description" multiline rows={3} />
            )}
          />

          <Controller
            name="photoUrl"
            control={control}
            render={({ field }) => <TextField {...field} label="Photo URL" />}
          />

          <Button variant="contained" type="submit" fullWidth>
            Update Product
          </Button>
        </Box>

        <Typography variant="body2" align="center" mt={2}>
          Back to Dashboard? <Link href="/dashboard">Dashboard</Link>
        </Typography>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Product updated successfully
        </Alert>
      </Snackbar>
    </>
  );
}
