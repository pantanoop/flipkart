"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { fetchProducts } from "../redux/productSlice";
import ProductCard from "../ProductCard/productCard";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const categories = ["Electronics", "Fashion", "Home", "Toys"];

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { isLoggedIn, c_user } = useAppSelector((state) => state.authenticator);
  const { productData, total, skip, limit, loading } = useAppSelector(
    (state) => state.productor,
  );

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const observer = useRef<IntersectionObserver>();

  const lastProductRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && productData.length < total) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, productData.length, total],
  );

  useEffect(() => {
    if (!isLoggedIn) router.push("/login");
  }, [isLoggedIn, router]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        limit,
        skip: (page - 1) * limit,
        searchTerm,
        searchCategory,
      }),
    );
  }, [dispatch, page, searchTerm, searchCategory, limit, skip]);

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Flipkart</Typography>

          <Box sx={{ flexGrow: 1, mx: 3 }}>
            <TextField
              placeholder="Search products..."
              size="small"
              variant="outlined"
              sx={{ backgroundColor: "white" }}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Typography variant="body1">{c_user?.username}</Typography>
        </Toolbar>

        {c_user?.role === "admin" && (
          <Box sx={{ p: 1, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={() => router.push("/addProduct")}
            >
              Add Product
            </Button>
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, p: 1 }}>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant="outlined"
              sx={{ backgroundColor: "white" }}
              onClick={() => {
                setSearchCategory(cat);
                setPage(1);
              }}
            >
              {cat}
            </Button>
          ))}
        </Box>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {productData.map((product, index) => {
            if (index === productData.length - 1) {
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={product.productid}
                  ref={lastProductRef}
                >
                  <ProductCard product={product} />
                </Grid>
              );
            } else {
              return (
                <Grid item xs={12} sm={6} md={4} key={product.productid}>
                  <ProductCard product={product} />
                </Grid>
              );
            }
          })}
        </Grid>
        {loading && <Typography mt={2}>Loading...</Typography>}
      </Container>
    </>
  );
}
