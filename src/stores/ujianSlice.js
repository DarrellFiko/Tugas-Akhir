import { createSlice } from "@reduxjs/toolkit";

const ujianSlice = createSlice({
  name: "ujian",
  initialState: {
    isUjian: false,
  },
  reducers: {
    setUjianMode: (state, action) => {
      state.isUjian = action.payload;
    },
    resetUjianMode: (state) => {
      state.isUjian = false;
    },
  },
});

export const { setUjianMode, resetUjianMode } = ujianSlice.actions;
export default ujianSlice.reducer;
