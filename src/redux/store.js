import { configureStore } from "@reduxjs/toolkit";
import itemReducer from "./itemSlice";
import bookReducer from "./bookSlice";

export const store = configureStore({
  reducer: {
    totalItems: itemReducer,
    totalBooks: bookReducer,
  },
});
