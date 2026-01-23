import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../services/productApi";

export interface Product {
  productid: number;
  productname: string;
  price: number;
  category: string;
  subcategory: string;
  description?: string;
  imageUrls: string[];
  rating?: number;
  sellerid: number;
}

interface ProductState {
  productData: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  total: number;
  skip: number;
  limit: number;
}

const initialState: ProductState = {
  productData: [],
  selectedProduct: null,
  loading: false,
  error: null,
  total: 0,
  skip: 0,
  limit: 10,
};

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (
    {
      page,
      limit,
      category,
      subcategory,
    }: {
      page?: number;
      limit?: number;
      category?: string;
      subcategory?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const data = await productService.getProducts({
        page: page ?? 1,
        limit: limit ?? 10,
        category,
        subcategory,
      });

      return {
        products: data.paginatedproducts ?? data.products,
        total: data.total,
        page: page ?? 1,
        limit: limit ?? 10,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      return await productService.getProductById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const addProduct = createAsyncThunk(
  "products/add",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      return await productService.addProduct(formData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async (
    {
      productid,
      data,
    }: {
      productid: number;
      data: any;
    },
    { rejectWithValue },
  ) => {
    try {
      return await productService.updateProduct(productid, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (productid: number, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(productid);
      return productid;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.productData = [];
      state.total = 0;
      state.page = 1;
      state.limit = 10;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productData = action.payload.products;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.productData = [];
        state.total = 0;
      })

      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.selectedProduct = null;
      })

      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productData.unshift(action.payload);
        state.total += 1;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.productData.findIndex(
          (p) => p.productid === action.payload.productid,
        );
        if (index !== -1) {
          state.productData[index] = action.payload;
        }
        if (
          state.selectedProduct &&
          state.selectedProduct.productid === action.payload.productid
        ) {
          state.selectedProduct = action.payload;
        }
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productData = state.productData.filter(
          (p) => p.productid !== action.payload,
        );
        state.total = state.total - 1;
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;
