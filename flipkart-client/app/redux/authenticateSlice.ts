import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { authService } from "@/app/services/auth.service";
import { findUser, createUser, googlesignin } from "../services/authApi";

interface currentUser {
  email: number;
  password: string;
  username: string;
  uid?: string;
  role?: string;
}

interface UserState {
  c_user: currentUser | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  c_user: null,
  loading: false,
  error: null,
  isLoggedIn: false,
};

export const registerUser = createAsyncThunk(
  "user/register",

  async (credentials: any, { rejectWithValue }) => {
    console.log(credentials, "credentials in register");
    try {
      return await createUser(credentials);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: any, { rejectWithValue }) => {
    console.log(credentials, "credentials in login");
    try {
      return await findUser(credentials);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const googleloginUser = createAsyncThunk(
  "user/login",
  async (credentials: any, { rejectWithValue }) => {
    console.log(credentials, "credentials in google login");

    try {
      return await googlesignin(credentials);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const authSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    logout: (state) => {
      state.c_user = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(registerUser.pending, (state) => {
        console.log("register pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log("register fulfilled", action.payload);
        state.loading = false;
        state.c_user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.log("register rejected");
        console.log("register error", state.error);
        state.loading = false;
        state.error = action.payload as string;
        state.c_user = null;
        state.isLoggedIn = false;
      })

      .addCase(loginUser.pending, (state) => {
        console.log("login pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("login fulfilled", action.payload);
        state.loading = false;
        state.c_user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log("login rejected");
        console.log("login error", state.error);
        state.loading = false;
        state.error = action.payload as string;
        state.c_user = null;
        state.isLoggedIn = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
