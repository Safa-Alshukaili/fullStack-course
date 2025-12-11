// src/Features/UserSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: {},
  isLoading: false,
  isSuccess: false,
  isError: false,
};

// ✅ تسجيل مستخدم
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("https://fullstack-server-pild.onrender.com/registerUser", data);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: "Register failed" });
    }
  }
);

// ✅ تسجيل دخول
export const login = createAsyncThunk(
  "users/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("https://fullstack-server-pild.onrender.com/login", data);
      return res.data.user;
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid credentials";
      alert(msg);
      return rejectWithValue({ error: msg });
    }
  }
);

// ✅ تسجيل خروج
export const logout = createAsyncThunk("users/logout", async () => {
  await axios.post("https://fullstack-server-pild.onrender.com/logout");
});

// ✅ تحديث البروفايل (مع صورة)
export const updateUserProfile = createAsyncThunk(
  "users/updateUserProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);

      // لو فيه باسورد جديد أضيفيه
      if (userData.password) {
        formData.append("password", userData.password);
      }

      // لو اختارت صورة جديدة
      if (userData.profilePic) {
        formData.append("profilePic", userData.profilePic);
      }

      const response = await axios.put(
        `http://localhost:3001/updateUserProfile/${userData.email}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.user;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data || { error: "Update failed" }
      );
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    // ===== register =====
    b.addCase(registerUser.pending, (s) => {
      s.isLoading = true;
    })
      .addCase(registerUser.fulfilled, (s) => {
        s.isLoading = false;
        s.isSuccess = true;
        s.isError = false;
      })
      .addCase(registerUser.rejected, (s) => {
        s.isLoading = false;
        s.isSuccess = false;
        s.isError = true;
      });

    // ===== login =====
    b.addCase(login.pending, (s) => {
      s.isLoading = true;
    })
      .addCase(login.fulfilled, (s, a) => {
        s.user = a.payload;
        s.isLoading = false;
        s.isSuccess = true;
        s.isError = false;
      })
      .addCase(login.rejected, (s) => {
        s.isLoading = false;
        s.isSuccess = false;
        s.isError = true;
      });

    // ===== logout =====
    b.addCase(logout.pending, (s) => {
      s.isLoading = true;
    })
      .addCase(logout.fulfilled, (s) => {
        s.user = {};
        s.isLoading = false;
        s.isSuccess = false;
        s.isError = false;
      })
      .addCase(logout.rejected, (s) => {
        s.isLoading = false;
        s.isError = true;
      });

    // ===== updateUserProfile =====
    b.addCase(updateUserProfile.pending, (state) => {
      state.isLoading = true;
    })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;   // تحديث بيانات المستخدم (بما فيها profilePic)
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(updateUserProfile.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default userSlice.reducer;
