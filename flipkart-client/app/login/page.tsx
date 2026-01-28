"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import "./login.css";

import { auth, googleProvider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";

import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { googleloginUser, loginUser } from "../redux/authenticateSlice";

const LoginSchema = z.object({
  useremail: z.string().email("Invalid email"),
  userpassword: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof LoginSchema>;

function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { isLoggedIn } = useAppSelector((state) => state.authenticator);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, router]);

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { useremail: "", userpassword: "" },
  });

  const handleLogin = async (data: LoginFormData) => {
    await dispatch(loginUser(data));
    setOpenSnackbar(true);
    setTimeout(() => router.push("/dashboard"), 1000);
  };

  const signInWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;

    await dispatch(
      googleloginUser({
        username: user.displayName,
        useremail: user.email,
        userid: Number(1234),
        role: "customer",
        userpassword: "123456",
      }),
    );

    setOpenSnackbar(true);
    setTimeout(() => router.push("/dashboard"), 1000);
  };

  return (
    <>
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-left">
            <img
              src="https://miro.medium.com/v2/da:true/resize:fit:1200/0*TWzaES26drwB7ESx"
              alt="Flipkart"
            />
          </div>
          <div className="login-right">
            <Card className="login-card">
              <Typography variant="h5">Login</Typography>
              <Typography className="login-subtitle">
                Get access to your Orders, Wishlist and Recommendations
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit(handleLogin)}
                className="login-form"
              >
                <Controller
                  name="useremail"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Email"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  name="userpassword"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                <div className="login-actions">
                  <Button type="submit" variant="contained">
                    Login
                  </Button>
                  <NextLink href="/register">
                    <Button variant="outlined">Sign up</Button>
                  </NextLink>
                </div>
                <Button
                  onClick={signInWithGoogle}
                  variant="outlined"
                  fullWidth
                  className="google-btn"
                >
                  <GoogleIcon /> Sign in with Google
                </Button>
              </Box>
            </Card>
          </div>
        </div>
      </div>
      <Snackbar open={openSnackbar} autoHideDuration={2000}>
        <Alert severity="success">Login successful 🎉</Alert>
      </Snackbar>
    </>
  );
}

export default Login;
