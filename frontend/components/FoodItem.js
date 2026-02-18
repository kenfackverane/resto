import React, { useState } from "react";
import { Modal } from "@mui/material";
import { Cancel, ShoppingCart, RemoveShoppingCart } from "@mui/icons-material";
import { add, remove } from "../redux/slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";

const FoodItem = ({ item }) => {
  const [openModal, setOpenModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  // support: cart = [] ou cart = { cartItems: [] }
  const cartState = useSelector((state) => state?.cart ?? []);
  const cartItems = Array.isArray(cartState) ? cartState : cartState?.cartItems ?? [];

  const inCart = cartItems.some((p) => p?._id === item?._id);

  const handleAddToCart = (e) => {
    e?.stopPropagation?.();
    dispatch(add(item));
    enqueueSnackbar(`Added ${item.name} to the cart`, {
      variant: "success",
      autoHideDuration: 2200,
    });
  };

  const handleRemoveFromCart = (e) => {
    e?.stopPropagation?.();
    dispatch(remove(item._id));
    enqueueSnackbar(`Removed ${item.name} from the cart`, {
      variant: "warning",
      autoHideDuration: 2200,
    });
  };

  const open = () => setOpenModal(true);
  const close = () => setOpenModal(false);

  return (
    <>
      {/* CARD */}
      <div
        onClick={open}
        className="group mt-5 mx-auto w-[275px] sm:w-60 rounded-2xl overflow-hidden cursor-pointer
                   border border-white/10 bg-gray-900/60 backdrop-blur
                   shadow-lg shadow-black/20 transition
                   hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30"
      >
        {/* image */}
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="h-44 w-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://res.cloudinary.com/jamesmarycloud/image/upload/v1653207144/home-page_ldrxp1.png";
            }}
          />

          {/* overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

          {/* price badge */}
          <div className="absolute top-3 right-3 rounded-full bg-emerald-400 px-3 py-1 text-xs font-extrabold text-emerald-950 shadow">
            {item.cost}
          </div>

          {/* subtle tag */}
          <div className="absolute bottom-3 left-3 rounded-full bg-black/30 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur">
            Fresh pick
          </div>
        </div>

        {/* content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-extrabold text-green-50 text-lg leading-tight line-clamp-1">
              {item.name}
            </h3>
          </div>

          <p className="mt-1 text-sm text-green-100/70 line-clamp-2">
            {item.description || "Delicious meal prepared with fresh ingredients."}
          </p>

          {/* actions */}
          <div className="mt-4 flex items-center justify-between gap-3">
            {inCart ? (
              <button
                onClick={handleRemoveFromCart}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl
                           border border-red-500/60 text-red-300
                           bg-red-500/10 px-3 py-2 font-bold text-sm transition
                           hover:bg-red-500 hover:text-white hover:border-red-500"
              >
                <RemoveShoppingCart fontSize="small" />
                Remove
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl
                           bg-emerald-400 text-emerald-950 px-3 py-2 font-extrabold text-sm transition
                           hover:bg-emerald-300 active:scale-[0.99]"
              >
                <ShoppingCart fontSize="small" />
                Add to cart
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              className="rounded-xl px-3 py-2 font-bold text-sm text-green-100/80 border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              View
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <Modal open={openModal} onClose={close}>
        <div
          className="outline-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     w-[92%] max-w-[520px] max-h-[85vh] overflow-hidden
                     rounded-3xl border border-white/10 bg-gray-900 shadow-2xl shadow-black/40"
        >
          {/* close */}
          <button
            onClick={close}
            className="absolute top-3 right-3 z-10 h-10 w-10 rounded-full bg-black/35 hover:bg-black/50
                       grid place-items-center text-white transition"
            aria-label="Close"
          >
            <Cancel className="text-white" />
          </button>

          {/* image header */}
          <div className="relative">
            <img
              src={item.image}
              alt={item.name}
              className="h-56 w-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://res.cloudinary.com/jamesmarycloud/image/upload/v1653207144/home-page_ldrxp1.png";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-white">{item.name}</h2>
                <p className="text-white/80 text-sm">Healthy • Tasty • Fast delivery</p>
              </div>
              <div className="rounded-2xl bg-emerald-400 px-4 py-2 font-extrabold text-emerald-950 shadow">
                {item.cost}
              </div>
            </div>
          </div>

          {/* body */}
          <div className="p-5 max-h-[calc(85vh-224px)] overflow-auto">
            <p className="text-green-100/85 leading-relaxed">
              {item.description || "No description provided."}
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button
                className="flex-1 rounded-2xl bg-emerald-400 px-4 py-3 font-extrabold text-emerald-950
                           hover:bg-emerald-300 transition"
                onClick={() => {
                  // Ici tu peux Router.push('/checkout') plus tard si tu veux
                  enqueueSnackbar("Order flow coming soon 🙂", {
                    variant: "info",
                    autoHideDuration: 2000,
                  });
                }}
              >
                Order now
              </button>

              {inCart ? (
                <button
                  onClick={handleRemoveFromCart}
                  className="flex-1 rounded-2xl border border-red-500/60 bg-red-500/10 px-4 py-3 font-extrabold text-red-300
                             hover:bg-red-500 hover:text-white transition"
                >
                  Remove from cart
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-extrabold text-green-50
                             hover:bg-white/10 transition"
                >
                  Add to cart
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FoodItem;
