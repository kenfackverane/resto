import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const foodSlice = createSlice({
  name: "foods",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchFoods.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export default foodSlice.reducer;

export const fetchFoods = createAsyncThunk("Food/fetch", async () => {
const user = JSON.parse(window.localStorage.getItem("user"));
console.log(user.email);
const url = 'https://resto-backend.vercel.app/api/foods';
const options = {method: 'GET', headers: {email: `${user.email}`, password: "admin01"}};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  return data.foods;
  console.log(data);
} catch (error) {
  console.error(error);
}
});
