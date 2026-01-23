import { configureStore } from "@reduxjs/toolkit";
import authenticateReducer from "./authenticateSlice";
import productReducer from "./productSlice";

export const makeStore = () => {
  return configureStore({
    reducer: { authenticator: authenticateReducer, productor: productReducer },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
