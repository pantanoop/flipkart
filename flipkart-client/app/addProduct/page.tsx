"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { addProduct } from "@/app/redux/productSlice";

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

import "./AddProduct.css";

const ProductSchema = z.object({
  productname: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  price: z.string().min(1, "Price is required"),
  quantity: z.coerce
    .number({ invalid_type_error: "Quantity must be a number" })
    .min(1, "Quantity must be at least 1"),
  description: z.string().optional(),
  images: z.array(z.instanceof(File)).optional(),
});

type ProductFormData = z.infer<typeof ProductSchema>;

export default function AddProduct() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const currentUser = useAppSelector((state) => state.authenticator.c_user);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      productname: "",
      category: "",
      subcategory: "",
      price: "",
      quantity: 1,
      description: "",
      images: [],
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    setSelectedImages(files);
    setValue("images", files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const handleAddProduct = (data: ProductFormData) => {
    const formData = new FormData();

    formData.append("productname", data.productname);
    formData.append("category", data.category);
    formData.append("subcategory", data.subcategory);
    formData.append("price", data.price);
    formData.append("quantity", String(data.quantity));
    formData.append("description", data.description || "");
    formData.append("sellerid", String(currentUser?.userid));

    selectedImages.forEach((file) => {
      formData.append("images", file);
    });

    dispatch(addProduct(formData));

    setOpenSnackbar(true);

    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <>
      <div className="add-product-container">
        <Card variant="outlined" className="add-product-card">
          <Typography variant="h5" className="add-product-title">
            Add Product
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(handleAddProduct)}
            className="add-product-form"
          >
            <Controller
              name="productname"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
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
                  value={field.value ?? ""}
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
                  value={field.value ?? ""}
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
                  value={field.value ?? ""}
                  label="Price"
                  type="number"
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              )}
            />

            <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? 1}
                  label="Quantity"
                  type="number"
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                  inputProps={{ min: 1 }}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  label="Description"
                  multiline
                  rows={3}
                />
              )}
            />

            <Button variant="outlined" component="label" className="image-btn">
              Select Images
              <input
                hidden
                multiple
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            <div className="image-preview">
              {previewUrls.map((url, i) => (
                <img key={i} src={url} alt="preview" />
              ))}
            </div>

            <Button variant="contained" type="submit" fullWidth>
              Add Product
            </Button>
          </Box>

          <Typography variant="body2" align="center" className="back-link">
            Back to Dashboard? <Link href="/dashboard">Dashboard</Link>
          </Typography>
        </Card>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">Product successfully added 🎉</Alert>
      </Snackbar>
    </>
  );
}
