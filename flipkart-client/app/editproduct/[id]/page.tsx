"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { updateProduct, fetchProductById } from "@/app/redux/productSlice";

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
  productname: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().optional(),
  images: z.array(z.instanceof(File)).optional(),
});

type ProductFormData = z.infer<typeof ProductSchema>;

export default function EditProduct() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = useParams();

  const { selectedProduct, loading } = useAppSelector(
    (state) => state.productor,
  );

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      productname: "",
      category: "",
      subcategory: "",
      price: "",
      description: "",
      images: [],
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number(id)));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedProduct) {
      reset({
        productname: selectedProduct.productname ?? "",
        category: selectedProduct.category ?? "",
        subcategory: selectedProduct.subcategory ?? "",
        price: String(selectedProduct.price ?? ""),
        description: selectedProduct.description ?? "",
        images: [],
      });

      if (selectedProduct.photoUrl) {
        setPreviewUrls([selectedProduct.photoUrl]);
      }
    }
  }, [selectedProduct, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    setSelectedImages(files);
    setValue("images", files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const handleUpdateProduct = (data: ProductFormData) => {
    console.log("update dta ui", data);
    const formData = new FormData();

    formData.append("productname", data.productname);
    formData.append("category", data.category);
    formData.append("subcategory", data.subcategory);
    formData.append("price", data.price);
    formData.append("description", data.description || "");

    selectedImages.forEach((file) => {
      formData.append("images", file);
    });

    dispatch(
      updateProduct({
        productid: Number(id),
        data: formData,
      }),
    );

    setOpenSnackbar(true);

    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  };

  if (loading) {
    return <Typography>Loading product...</Typography>;
  }

  return (
    <>
      <Card variant="outlined" sx={{ p: 4, minWidth: 380 }}>
        <Typography variant="h5" textAlign="center" mb={2}>
          Edit Product
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField label="Product ID" value={id} disabled fullWidth />
          <TextField
            label="Seller ID"
            value={selectedProduct?.sellerid}
            disabled
            fullWidth
          />
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

          <Button variant="outlined" component="label">
            Change Images
            <input
              hidden
              multiple
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {previewUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                width={70}
                height={70}
                style={{ objectFit: "cover", borderRadius: 4 }}
                alt="preview"
              />
            ))}
          </Box>

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
        <Alert severity="success">Product updated successfully ✅</Alert>
      </Snackbar>
    </>
  );
}
