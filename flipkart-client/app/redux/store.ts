// import { configureStore } from "@reduxjs/toolkit";
// import authenticateReducer from "./authenticateSlice";
// import productReducer from "./productSlice";

// export const makeStore = () => {
//   return configureStore({
//     reducer: { authenticator: authenticateReducer, productor: productReducer },
//   });
// };

// // Infer the type of makeStore
// export type AppStore = ReturnType<typeof makeStore>;
// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<AppStore["getState"]>;
// export type AppDispatch = AppStore["dispatch"];

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authenticateSlice";
import productReducer from "./productSlice";
import orderReducer from "./orderSlice";
import coupounReducer from "./coupounSlice";
import imageReducer from "./imageSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authenticator", "order"],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    authenticator: authReducer,
    productor: productReducer,
    order: orderReducer,
    coupoun: coupounReducer,
    image: imageReducer,
  }),
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
// // export type RootState = ReturnType<AppStore["getState"]>;
// export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/authSlice';

// export const makeStore = () => {
//   return configureStore({
//     reducer: {
//       auth: authReducer,
//     },
//   });
// };

// export type AppStore = ReturnType<typeof makeStore>;
// export type RootState = ReturnType<AppStore['getState']>;
// export type AppDispatch = AppStore['dispatch'];
