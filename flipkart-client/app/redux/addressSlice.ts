import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const saveAddress = createAsyncThunk(
  "address/save",
  async (
    payload: {
      userid: number;
      houseNo: string;
      area: string;
      city: string;
      state: string;
      pincode: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/address`, payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);
