import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nama: localStorage.getItem("authUser") || "",
  profilePicture: localStorage.getItem("profilePicture") || "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { nama, profilePicture } = action.payload;
      state.nama = nama;
      state.profilePicture = profilePicture;

      localStorage.setItem("authUser", nama);
      localStorage.setItem("profilePicture", profilePicture);
    },
    updateProfilePicture: (state, action) => {
      state.profilePicture = action.payload;
      localStorage.setItem("profilePicture", action.payload);
    },
    clearUser: (state) => {
      state.nama = "";
      state.profilePicture = "";

      localStorage.removeItem("authUser");
      localStorage.removeItem("profilePicture");
    },
  },
});

export const { setUser, updateProfilePicture, clearUser } = userSlice.actions;
export default userSlice.reducer;
