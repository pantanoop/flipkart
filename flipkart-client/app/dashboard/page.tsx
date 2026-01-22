"use client";

import { useEffect } from "react";
import { useAppSelector } from "../hooks/hooks";
import { useRouter } from "next/navigation";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function Dashboard() {
  const router = useRouter();
  const { isLoggedIn, c_user } = useAppSelector((state) => state.authenticator);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

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
              sx={{
                backgroundColor: "white",
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
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Box>
          <Typography variant="h4">
            Welcome to Flipkart, {c_user?.role}
          </Typography>
        </Box>
      </Container>
    </>
  );
}

export default Dashboard;
