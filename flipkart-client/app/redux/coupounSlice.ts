import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { coupounService } from "../services/coupounApi";

interface CoupounState {
  discount: string | null;
  error: string | null;
  loading: boolean;
}

const initialState: CoupounState = {
  discount: null,
  loading: false,
  error: null,
};

export const findDiscountCoupoun = createAsyncThunk(
  "cart/coupoun",
  async (data: any, { rejectWithValue }) => {
    console.log(data, "credentials in ");
    try {
      return await coupounService.findCoupoun(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const coupounSlice = createSlice({
  name: "coupoun",
  initialState,
  reducers: {
    // logout: (state) => {
    //   state.c_user = null;
    //   state.isLoggedIn = false;
    // },
  },
  extraReducers: (builder) => {
    builder

      .addCase(findDiscountCoupoun.pending, (state) => {
        console.log("login pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(findDiscountCoupoun.fulfilled, (state, action) => {
        console.log("coupoun discount", action.payload);
        state.loading = false;
        state.discount = action.payload;
      })
      .addCase(findDiscountCoupoun.rejected, (state, action) => {
        console.log("login rejected");
        console.log("login error", state.error);
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {} = coupounSlice.actions;
export default coupounSlice.reducer;
