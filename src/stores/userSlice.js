import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id_user: localStorage.getItem("id_user") || null,
  nama: localStorage.getItem("authUser") || "",
  role: localStorage.getItem("role") || "",
  profilePicture: localStorage.getItem("profilePicture") || "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { id_user, nama, role, profilePicture } = action.payload;
      state.id_user = id_user;
      state.nama = nama;
      state.role = role;
      state.profilePicture = profilePicture;

      localStorage.setItem("id_user", id_user);
      localStorage.setItem("authUser", nama);
      localStorage.setItem("role", role);
      localStorage.setItem("profilePicture", profilePicture);
    },
    updateProfilePicture: (state, action) => {
      state.profilePicture = action.payload;
      localStorage.setItem("profilePicture", action.payload);
    },
    clearUser: (state) => {
      state.id_user = null;
      state.nama = "";
      state.role = "";
      state.profilePicture = "";

      localStorage.removeItem("id_user");
      localStorage.removeItem("authUser");
      localStorage.removeItem("role");
      localStorage.removeItem("profilePicture");
    },
  },
});

export const { setUser, updateProfilePicture, clearUser } = userSlice.actions;
export default userSlice.reducer;
