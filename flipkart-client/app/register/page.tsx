"use client";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import "./register.css";

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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { googleloginUser, registerUser } from "../redux/authenticateSlice";

const RoleSchema = z.enum(["customer", "seller"]);

const RegistrationSchema = z
  .object({
    username: z.string().min(3),
    useremail: z.string().email(),
    role: RoleSchema,
    userpassword: z.string().min(6),
    userconfirmpassword: z.string().min(1),
  })
  .refine((data) => data.userpassword === data.userconfirmpassword, {
    path: ["confirmpassword"],
    message: "Passwords do not match",
  });

type RegistrationSchemaType = z.infer<typeof RegistrationSchema>;

function Register() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { isLoggedIn } = useAppSelector((state) => state.authenticator);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, router]);

  const { control, handleSubmit } = useForm<RegistrationSchemaType>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      username: "",
      useremail: "",
      userpassword: "",
      userconfirmpassword: "",
      role: "customer",
    },
  });

  const handleRegister = async (data: RegistrationSchemaType) => {
    await dispatch(registerUser(data));
    console.log(isLoggedIn);
    if (isLoggedIn) {
      setOpenSnackbar(true);
      setTimeout(() => router.push("/dashboard"), 1000);
    } else {
      router.push("/register");
    }
  };

  const signInWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;

    await dispatch(
      googleloginUser({
        username: user.displayName,
        useremail: user.email,
        userid: user.uid,
        role: "customer",
        userpassword: "123456",
      }),
    );

    setOpenSnackbar(true);
    setTimeout(() => router.push("/dashboard"), 1000);
  };

  return (
    <>
      <div className="register-wrapper">
        <div className="register-container">
          <div className="register-left">
            <img
              src="https://miro.medium.com/v2/da:true/resize:fit:1200/0*TWzaES26drwB7ESx"
              alt="Flipkart"
            />
          </div>

          <div className="register-right">
            <Card className="register-card">
              <Typography variant="h5">Sign Up</Typography>
              <Typography className="register-subtitle">
                Get access to your Orders, Wishlist and Recommendations
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit(handleRegister)}
                className="register-form"
              >
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Username" fullWidth />
                  )}
                />

                <Controller
                  name="useremail"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Email" fullWidth />
                  )}
                />

                <Controller
                  name="userpassword"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      fullWidth
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

                <Controller
                  name="userconfirmpassword"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
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

                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Role</InputLabel>
                      <Select {...field} label="Role">
                        <MenuItem value="customer">Customer</MenuItem>
                        <MenuItem value="seller">Seller</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />

                <div className="register-actions">
                  <Button type="submit" variant="contained">
                    Sign Up
                  </Button>

                  <NextLink href="/login">
                    <Button variant="outlined">Login</Button>
                  </NextLink>
                </div>

                <Button
                  onClick={signInWithGoogle}
                  variant="outlined"
                  fullWidth
                  className="google-btn"
                >
                  <GoogleIcon /> Sign up with Google
                </Button>
              </Box>
            </Card>
          </div>
        </div>
      </div>

      <Snackbar open={openSnackbar} autoHideDuration={2000}>
        <Alert severity="success">User successfully registered 🎉</Alert>
      </Snackbar>
    </>
  );
}

export default Register;
