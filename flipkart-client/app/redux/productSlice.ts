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
  isBanned?: boolean;
}

interface CartItem {
  id: number;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

interface WishlistItem {
  id: number;
  productName: string;
  price: number;
  image: string;
}

interface ProductState {
  productData: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  total: number;
  limit: number;
  cart: CartItem[];
  wishlist: WishlistItem[];
}

const initialState: ProductState = {
  productData: [],
  selectedProduct: null,
  loading: false,
  error: null,
  total: 0,
  limit: 10,
  cart: [],
  wishlist: [],
};

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (
    {
      page = 1,
      limit = 10,
      category,
      subcategory,
      searchTerm,
      userid,
    }: {
      page?: number;
      limit?: number;
      category?: string;
      subcategory?: string;
      searchTerm?: string;
      userid?: number;
    },
    { rejectWithValue },
  ) => {
    console.log("slice", userid);
    try {
      return await productService.getProducts({
        page,
        limit,
        category,
        subcategory,
        searchTerm,
        userid,
      });
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
      data: FormData;
    },
    { rejectWithValue },
  ) => {
    try {
      return await productService.update(productid, data);
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

export const banProduct = createAsyncThunk(
  "products/ban",
  async (productid: number, { rejectWithValue }) => {
    console.log(productid);
    try {
      return await productService.banProduct(productid);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const addToWishlist = createAsyncThunk(
  "products/addwishlist",
  async (
    {
      productid,
      userid,
    }: {
      productid: number;
      userid: number;
    },
    { rejectWithValue },
  ) => {
    try {
      return await productService.addWishlist({ productid, userid });
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getWishlistItems = createAsyncThunk(
  "products/wislist",
  async (userid: number, { rejectWithValue }) => {
    try {
      return await productService.getWishlist(userid);
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
      state.error = null;
    },
    addToCart: (state, action) => {
      const item = action.payload;
      console.log("product slice", item);

      const existing = state.cart.find((p) => p.id === item.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.cart.push({ ...item, quantity: 1 });
      }
      console.log("add to cart", state.cart);
    },

    increaseQty: (state, action) => {
      const item = state.cart.find((p) => p.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    decreaseQty: (state, action) => {
      const item = state.cart.find((p) => p.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.cart = state.cart.filter((p) => p.id !== action.payload);
        }
      }
    },

    clearCart: (state) => {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        // console.log("slice", action.payload);
        state.loading = false;

        const { data, meta } = action.payload;

        if (meta.page === 1) {
          state.productData = data;
        } else {
          const existingIds = new Set(
            state.productData.map((p) => p.productid),
          );
          const newProducts = data.filter(
            (p: any) => !existingIds.has(p.productid),
          );
          state.productData.push(...newProducts);
        }

        state.total = meta.total;
        state.limit = meta.limit;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
      .addCase(addProduct.fulfilled, (state, action) => {
        state.productData.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
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
        state.productData = state.productData.filter(
          (p) => p.productid !== action.payload,
        );
        state.total -= 1;
      })
      .addCase(banProduct.fulfilled, (state, action) => {
        const updated = action.payload.data;

        const index = state.productData.findIndex(
          (p) => p.productid === updated?.productid,
        );

        if (index !== -1) {
          state.productData[index].isBanned = updated.isBanned;
        }
        console.log(
          state.productData[index]?.isBanned,
          "product slice ban product",
        );
      })
      .addCase(addToWishlist.fulfilled, () => {
        console.log("added the product in wishlist");
      })

      .addCase(getWishlistItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishlistItems.fulfilled, (state, action) => {
        state.loading = false;
        console.log("slice", action.payload);
        state.wishlist = action.payload;
      })
      .addCase(getWishlistItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProducts, clearCart, addToCart, increaseQty, decreaseQty } =
  productSlice.actions;
export default productSlice.reducer;
