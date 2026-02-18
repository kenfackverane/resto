import { createSlice } from "@reduxjs/toolkit";

// ✅ Structure pro: items + qty
const initialState = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    add(state, action) {
      const item = action.payload;
      const exist = state.find((x) => x._id === item._id);

      if (exist) {
        exist.qty = (exist.qty || 1) + 1;
      } else {
        state.push({ ...item, qty: 1 });
      }
    },

    remove(state, action) {
      // action.payload = _id
      return state.filter((item) => item._id !== action.payload);
    },

    increaseQty(state, action) {
      const id = action.payload;
      const exist = state.find((x) => x._id === id);
      if (exist) exist.qty = (exist.qty || 1) + 1;
    },

    decreaseQty(state, action) {
      const id = action.payload;
      const exist = state.find((x) => x._id === id);
      if (!exist) return;

      const nextQty = (exist.qty || 1) - 1;
      if (nextQty <= 1) {
        exist.qty = 1; // on garde minimum 1 (ou tu peux supprimer si tu veux)
      } else {
        exist.qty = nextQty;
      }
    },

    clearCart() {
      return [];
    },
  },
});

export const { add, remove, increaseQty, decreaseQty, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
