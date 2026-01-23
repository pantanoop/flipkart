"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../redux/productSlice";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  Card,
  Snackbar,
  Alert,
} from "@mui/material";

const ProductSchema = z.object({
  productname: z.string().min(1, "must have a name"),
  price: z.number(),
  category: z.string().min(1, "must have a product category"),
  subcategory: z.string().min(1, "must have a product sub-category"),
  description: z.string().max(600, "must be less than 600 characters"),
  photoUrl: z.string().url(),
});

function AddProductForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  // const products = useSelector((state) => state.tenator.products);
  // const currentUser = useSelector((state) => state.authenticator.currentUser);
  //   const tnt = useSelector((state) => state.tenator);
  //   const products = tnt.products;
  //   console.log("fgehjfvhb",products);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ProductSchema),
  });
  console.log("hhe", errors);
  const handleAddProduct = (data) => {
    console.log("ehcvhvchvc", data);
    const existingProduct = products.some((p) => p.id === data.id);
    if (existingProduct) {
      setError("id", {
        type: "manual",
        message: "can't add this product as it already exists",
      });
      return;
    }
    console.log("wegcjhgcj");
    dispatch(
      addProduct({
        ...data,
        sellerEmail: currentUser.email,
        banned: false,
      }),
    );
    setOpenSnackbar(true);
    setTimeout(() => {
      navigate("/sellerdashboard");
    }, 1200);
  };

  return (
    <>
      <Card variant="outlined" sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" textAlign="center" mb={2}>
          Add Product
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(handleAddProduct)}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Controller
            name="productName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Product Name"
                fullWidth
                error={!!errors.productName}
                helperText={errors.productName?.message}
              />
            )}
          />

          <Controller
            name="id"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="id"
                fullWidth
                error={!!errors?.id}
                helperText={errors?.id?.message}
              />
            )}
          />

          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="quantity"
                fullWidth
                error={!!errors?.quantity}
                helperText={errors?.quantity?.message}
              />
            )}
          />

          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="category"
                fullWidth
                error={!!errors.category}
                helperText={errors?.category?.message}
              />
            )}
          />
          <Controller
            name="isOutOfStock"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Out of STock"
                fullWidth
                error={!!errors.isOutOfStock}
                helperText={errors?.isOutOfStock?.message}
              />
            )}
          />
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="price"
                fullWidth
                error={!!errors?.price}
                helperText={errors?.price?.message}
              />
            )}
          />

          <Button variant="contained" type="submit" fullwidth>
            Add Product
          </Button>
        </Box>

        <Typography variant="body2" align="center" mt={2}>
          Back TO Dashboard?{" "}
          <Link component={RouterLink} to="/sellerdashboard" underline="hover">
            Dashboard
          </Link>
        </Typography>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Product successfully added 🎉
        </Alert>
      </Snackbar>
    </>
  );
}

export default AddProductForm;
