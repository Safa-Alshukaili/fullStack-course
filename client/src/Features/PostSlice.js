// src/Features/PostSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = { posts: [], status: "idle", error: null };

// حفظ بوست
export const savePost = createAsyncThunk(
  "posts/savePost",
  async (postData, { rejectWithValue }) => {
    try {
      const res = await axios.post("https://fullstack-course-server-k2pj.onrender.com/savePost", {
        postMsg: postData.postMsg,
        email: postData.email,
      });
      return res.data.post;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: "Save failed" });
    }
  }
);

// جلب البوستات
export const getPosts = createAsyncThunk(
  "posts/getPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("https://fullstack-course-server-k2pj.onrender.com/getPosts");
      return res.data.posts;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: "Fetch failed" });
    }
  }
);

// ✅ اللايك / أنلايك
export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postData, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `https://fullstack-course-server-k2pj.onrender.com/likePost/${postData.postId}`,
        {
          userId: postData.userId, // هنا نرسل الإيميل
        }
      );
      return res.data.post; // البوست بعد التحديث
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: "Like failed" });
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    // savePost
    b.addCase(savePost.pending, (s) => {
      s.status = "loading";
    })
      .addCase(savePost.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.posts.unshift(a.payload);
      })
      .addCase(savePost.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload?.error;
      });

    // getPosts
    b.addCase(getPosts.pending, (s) => {
      s.status = "loading";
    })
      .addCase(getPosts.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.posts = a.payload;
      })
      .addCase(getPosts.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload?.error;
      });

    // ✅ likePost
    b.addCase(likePost.pending, (state) => {
      state.status = "loading";
    })
      .addCase(likePost.fulfilled, (state, action) => {
        state.status = "succeeded";
        const idx = state.posts.findIndex(
          (p) => p._id === action.payload._id
        );
        if (idx !== -1) {
          state.posts[idx].likes = action.payload.likes;
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error || action.error.message;
      });
  },
});

export default postSlice.reducer;
