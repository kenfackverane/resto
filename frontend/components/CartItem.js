import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { remove } from "../redux/slices/cartSlice";
import { useSnackbar } from "notistack";
import { DeleteOutline } from "@mui/icons-material";

const CartItem = ({ item }) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const qty = Number(item?.qty ?? 1);

  const priceNumber = useMemo(() => {
    // support: "€6.90", "6900", "6.90", etc.
    const raw = String(item?.cost ?? "").replace(",", ".").replace(/[^\d.]/g, "");
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }, [item?.cost]);

  const lineTotal = useMemo(() => {
    if (priceNumber === null) return null;
    return priceNumber * qty;
  }, [priceNumber, qty]);

  const handleRemoveFromCart = () => {
    dispatch(remove(item._id));
    enqueueSnackbar(`Removed ${item.name} from the cart`, {
      variant: "warning",
      autoHideDuration: 2200,
    });
  };

  return (
    <div className="mt-3 rounded-2xl border border-white/10 bg-gray-900/60 backdrop-blur shadow-lg shadow-black/20 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* image */}
        <img
          src={item.image}
          alt={item.name}
          className="h-28 w-full sm:w-28 sm:h-28 rounded-2xl object-cover border border-white/10"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://res.cloudinary.com/jamesmarycloud/image/upload/v1653207144/home-page_ldrxp1.png";
          }}
        />

        {/* info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg sm:text-xl text-green-50 font-extrabold truncate">
              {item.name}
            </h3>

            {/* delete */}
            <button
              onClick={handleRemoveFromCart}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2
                         text-green-100/80 hover:bg-red-500 hover:text-white hover:border-red-500 transition"
              aria-label="Remove item"
              title="Remove"
            >
              <DeleteOutline fontSize="small" />
              <span className="hidden sm:inline font-bold text-sm">Remove</span>
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {/* qty badge */}
            <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-bold text-white/90">
              Qty: {qty}
            </span>

            {/* price */}
            <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-extrabold text-emerald-950">
              Price: {item.cost}
            </span>

            {/* total */}
            {lineTotal !== null && (
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-green-100/80 border border-white/10">
                Total: €{lineTotal.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
