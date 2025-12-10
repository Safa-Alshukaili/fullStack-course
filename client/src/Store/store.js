//src/Store/store.js
import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../Features/UserSlice.js";
import postReducer from "../Features/PostSlice.js";

export const store = configureStore({
  reducer: { users: usersReducer, posts: postReducer },
  devTools: { name: "PostIT Store", trace: true },
});
