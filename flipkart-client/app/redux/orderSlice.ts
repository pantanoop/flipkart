import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (
    payload: {
      userid: number;
      discountApplied: string;
      items: { productid: number; quantity: number }[];
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/orders`, payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Order failed");
    }
  },
);

export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (userid: number, { rejectWithValue }) => {
    console.log("hitted order fetch", userid);
    try {
      const res = await axios.get(`${API_BASE_URL}/orders/user/${userid}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);
export const fetchSellerOrders = createAsyncThunk(
  "order/fetchSellerOrders",
  async (sellerid: number, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/orders/seller/${sellerid}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch seller orders",
      );
    }
  },
);

export const fetchAllOrdersAdmin = createAsyncThunk(
  "order/fetchAllOrdersAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/orders/admin/all`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (payload: { orderid: string; userid: number }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/orders/${payload.orderid}/cancel`,
        { userid: payload.userid },
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    success: false,
    error: null as string | null,

    order: null as any,
    orders: [] as any[],
  },
  reducers: {
    resetOrderState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSellerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload || [];
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.orders = [];
        state.error = action.payload as string;
      })
      .addCase(fetchAllOrdersAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrdersAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload || [];
      })
      .addCase(fetchAllOrdersAdmin.rejected, (state, action) => {
        state.loading = false;
        state.orders = [];
        state.error = action.payload as string;
      })
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map((o) =>
          o.orderid === action.payload.orderid ? action.payload : o,
        );
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
