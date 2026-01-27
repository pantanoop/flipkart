import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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
      const res = await axios.post("http://localhost:5000/address", payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);
