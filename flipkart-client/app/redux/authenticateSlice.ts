import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { authService } from "@/app/services/auth.service";
import {
  findUser,
  createUser,
  googlesignin,
  toggleBanUser,
  getUsers,
} from "../services/authApi";

interface User {
  useremail: string;
  userpassword?: string;
  username: string;
  userid: number;
  role?: string;
  isBanned?: boolean;
}

interface UserState {
  users: User[];
  total: number;
  page: number;
  limit: number;
  c_user: User | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  users: [],
  total: 0,
  page: 1,
  limit: 5,
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

export const fetchUsers = createAsyncThunk(
  "auth/fetchUsers",
  async (
    { page, limit }: { page: number; limit: number },
    { rejectWithValue },
  ) => {
    try {
      return await getUsers({ page, limit });
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const toggleUserBan = createAsyncThunk(
  "user/toggleBan",
  async (userid: number, { rejectWithValue }) => {
    try {
      return await toggleBanUser(userid);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
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
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(...action.payload.data);
        state.total = action.payload.total;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
      })
      .addCase(toggleUserBan.fulfilled, (state, action) => {
        console.log(action.payload);
        const updatedUser = action.payload;

        const index = state.users.findIndex(
          (u) => u.userid === updatedUser.userid,
        );

        if (index !== -1) {
          state.users[index].isBanned = updatedUser.isBanned;
        }
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
