"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { fetchImagesThunk } from "../redux/imageSlice";
import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

import {
  deleteProduct,
  fetchProducts,
  clearProducts,
  banProduct,
} from "../redux/productSlice";
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
import { logout } from "../redux/authenticateSlice";

const categories = ["electronics", "fashion", "home", "toys"];
const subcategoriesMap = {
  electronics: ["mobiles", "home appliances", "computer accessories"],
  fashion: ["mens wear", "women section", "kids section"],
  home: ["groceries", "cosmetics", "kitchen"],
  toys: ["card games", "computer games", "board games"],
};

interface Image {
  id: number;
  url: string;
}

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { isLoggedIn, c_user } = useAppSelector((state) => state.authenticator);
  const wishlist = useAppSelector((state) => state.productor.wishlist);

  const { productData, total, limit, loading } = useAppSelector(
    (state) => state.productor,
  );
  const cartItems = useAppSelector((state) => state.productor.cart);

  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const images = useAppSelector((state) => state.image.images as Image[]);

  const observer = useRef<IntersectionObserver | null>(null);
  const hasMore = productData.length < total;

  useEffect(() => {
    console.log("corosel useffect hit in dashboard");
    dispatch(fetchImagesThunk());
  }, [dispatch]);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const visibleItems = Math.min(4, images?.length);

  const prevSlide = () => setCarouselIndex((prev) => Math.max(prev - 1, 0));

  const nextSlide = () =>
    setCarouselIndex((prev) =>
      Math.min(prev + 1, images.length - visibleItems),
    );

  useEffect(() => {
    if (images?.length === 0) return;

    const interval = setInterval(() => {
      setCarouselIndex((prev) =>
        prev < images?.length - visibleItems ? prev + 1 : 0,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images, visibleItems]);

  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  useEffect(() => {
    if (!isLoggedIn) router.push("/login");
  }, [isLoggedIn, router]);

  useEffect(() => {
    const trimmed = searchTerm.trim();

    const handler = setTimeout(() => {
      if (debouncedSearchTerm !== trimmed) {
        setDebouncedSearchTerm(trimmed);
        setPage(1);
        dispatch(clearProducts());
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, dispatch]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        page,
        limit,
        category,
        subcategory,
        searchTerm: debouncedSearchTerm,
        userid: Number(c_user?.userid),
      }),
    );
  }, [
    dispatch,
    page,
    limit,
    category,
    subcategory,
    debouncedSearchTerm,
    wishlist,
  ]);

  function handleDelete(productid: number) {
    dispatch(deleteProduct(productid));
  }

  function handleBan(productid: number) {
    console.log("ran handle ban", productid);
    dispatch(banProduct(productid));
  }

  function handleClickCategory(cat: string) {
    setCategory(cat);
    setSubcategory("");
    setPage(1);
    setSearchTerm("");
    dispatch(clearProducts());
  }

  function handleClickLogo() {
    setPage(1);
    setCategory("");
    setSubcategory("");
    setSearchTerm("");
    setDebouncedSearchTerm("");
    // dispatch(clearProducts());
    router.push("/dashboard");
  }

  function handleLogout() {
    dispatch(logout());
    dispatch(clearProducts());
  }

  function handleCartClick() {
    router.push("/cart");
  }
  function handleClickOrder() {
    router.push("/orders");
  }

  function handleClickWishlist() {
    router.push("/wishlist");
  }

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#2874f0" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="h6"
              sx={{ cursor: "pointer", fontWeight: "bold", color: "white" }}
              onClick={handleClickLogo}
            >
              Flipkart
            </Typography>

            {c_user?.role === "customer" && (
              <>
                <IconButton onClick={handleCartClick}>
                  <Badge badgeContent={cartItems?.length || 0} color="error">
                    <ShoppingCartIcon sx={{ color: "white" }} />
                  </Badge>
                </IconButton>
                <IconButton onClick={handleClickWishlist}>
                  <Badge>
                    <FavoriteBorderOutlinedIcon sx={{ color: "pink" }} />
                  </Badge>
                </IconButton>
              </>
            )}

            <IconButton onClick={handleClickOrder}>
              <Badge color="error">
                <LocalShippingIcon sx={{ color: "white" }} />
              </Badge>
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, maxWidth: 600, mx: 3 }}>
            <TextField
              placeholder="Search products..."
              size="small"
              fullWidth
              value={searchTerm}
              sx={{ backgroundColor: "white", borderRadius: 1 }}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton disabled>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Typography sx={{ color: "white", mr: 2 }}>
            {c_user?.username}
          </Typography>

          <Button
            sx={{ backgroundColor: "white", color: "red" }}
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </Toolbar>

        {!category && (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, p: 1 }}>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant="outlined"
                sx={{ backgroundColor: "white", color: "black" }}
                onClick={() => handleClickCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </Box>
        )}

        {category && (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, p: 1 }}>
            {subcategoriesMap[category as keyof typeof subcategoriesMap]?.map(
              (sub) => (
                <Button
                  key={sub}
                  variant={sub === subcategory ? "contained" : "outlined"}
                  sx={{ backgroundColor: "white", color: "black" }}
                  onClick={() => {
                    setSubcategory(sub);
                    setPage(1);
                    dispatch(clearProducts());
                  }}
                >
                  {sub}
                </Button>
              ),
            )}
          </Box>
        )}
      </AppBar>
      {(c_user?.role === "admin" || c_user?.role === "seller") && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={() => router.push("/addProduct")}
          >
            Add Product
          </Button>
        </Box>
      )}
      {c_user?.role === "admin" && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={() => router.push("/users")}>
            User List
          </Button>
        </Box>
      )}

      {images?.length > 0 && (
        <Carousel
          showArrows={true}
          infiniteLoop={true}
          autoPlay={true}
          interval={1000} // time in milliseconds
          showThumbs={false} // hide the thumbnail navigation
          useKeyboardArrows={true}
          // sx={{ mt: 7 }}
        >
          {images.map((img) => (
            <div key={img.id}>
              <div>
                <img
                  style={{
                    objectFit: "fill",
                    width: "100%",
                    height: "600px",
                    marginTop: "40px",
                  }}
                  src={img.url}
                  alt="carousel"
                />
              </div>
            </div>
          ))}
        </Carousel>
      )}

      <Container sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {productData.map((product: any, index: any) => {
            const isLast = index === productData.length - 1;

            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={product.productid}
                ref={isLast ? lastProductRef : null}
              >
                <ProductCard
                  product={product}
                  handleDelete={handleDelete}
                  handleBan={handleBan}
                />
              </Grid>
            );
          })}
        </Grid>

        {loading && (
          <Typography align="center" mt={3}>
            Loading...
          </Typography>
        )}

        {!hasMore && !loading && (
          <Typography align="center" mt={3}>
            No more products
          </Typography>
        )}
      </Container>
    </>
  );
}
