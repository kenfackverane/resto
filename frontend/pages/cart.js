import React, { useMemo } from "react";
import CartItem from "../components/CartItem";
import { useSelector } from "react-redux";
import Link from "next/link";

const CartPage = () => {
  const cartState = useSelector((state) => state?.cart ?? []);
  const cartItems = Array.isArray(cartState) ? cartState : cartState?.cartItems ?? [];

  const { totalItems, totalAmount } = useMemo(() => {
    const items = cartItems || [];

    const totalItemsCount = items.reduce((sum, it) => sum + Number(it?.qty ?? 1), 0);

    const total = items.reduce((sum, it) => {
      const qty = Number(it?.qty ?? 1);

      // support: "€6.90", "6,90", "6900", etc.
      const raw = String(it?.cost ?? "").replace(",", ".").replace(/[^\d.]/g, "");
      const price = Number(raw);

      if (!Number.isFinite(price)) return sum;
      return sum + price * qty;
    }, 0);

    return { totalItems: totalItemsCount, totalAmount: total };
  }, [cartItems]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full rounded-3xl border border-white/10 bg-gray-900/60 backdrop-blur p-6 text-center shadow-xl shadow-black/20">
          <h1 className="text-green-50 font-extrabold text-2xl">Your cart is empty</h1>
          <p className="text-green-100/70 mt-2">
            Add some tasty meals and come back here.
          </p>

          <Link href="/foods">
            <button className="mt-6 w-full rounded-2xl bg-emerald-400 px-5 py-3 font-extrabold text-emerald-950 hover:bg-emerald-300 transition">
              Explore meals
            </button>
          </Link>

          <p className="text-xs text-green-100/60 mt-3">Secure checkout • Fast delivery</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-green-50">Your Cart</h1>
          <p className="text-green-100/70">Review items before placing your order.</p>
        </div>

        <Link href="/foods">
          <a className="hidden sm:inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-2 font-bold text-green-100/80 hover:bg-white/10 transition">
            + Add more
          </a>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT: items */}
        <div className="flex flex-col">
          {cartItems.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>

        {/* RIGHT: summary */}
        <div className="md:sticky md:top-24 h-fit">
          <div className="rounded-3xl border border-white/10 bg-gray-900/60 backdrop-blur p-6 shadow-xl shadow-black/20">
            <h2 className="text-green-50 font-extrabold text-lg tracking-wide">
              CART SUMMARY
            </h2>

            <div className="mt-4 space-y-3 text-green-100/85">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total items</span>
                <span className="font-extrabold text-emerald-300">{totalItems}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold">Subtotal</span>
                <span className="font-extrabold text-emerald-300">
                  €{totalAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold">Delivery</span>
                <span className="font-extrabold text-green-50">Free</span>
              </div>

              <div className="h-px bg-white/10 my-2" />

              <div className="flex items-center justify-between">
                <span className="font-extrabold text-green-50">Total</span>
                <span className="font-extrabold text-emerald-300 text-xl">
                  €{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <Link href="/order">
              <button className="mt-6 w-full rounded-2xl bg-emerald-400 px-5 py-3 font-extrabold text-emerald-950 hover:bg-emerald-300 transition">
                Order Now
              </button>
            </Link>

            <Link href="/foods">
              <button className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-extrabold text-green-50 hover:bg-white/10 transition sm:hidden">
                Add more meals
              </button>
            </Link>

            <p className="text-xs text-green-100/60 mt-4">
              By ordering you agree to our terms. Secure payment recommended.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
