import React, { useMemo, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { useRouter } from "next/router";
import { useMediaQuery, useTheme, Drawer, IconButton } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { userLogout } from "../../redux/slices/userSlice";

import {
  ShoppingBasket,
  Menu,
  Home,
  PersonAdd,
  AdminPanelSettingsOutlined,
  Logout,
  Explore,
  Close,
} from "@mui/icons-material";

const NavLink = ({ href, label, active }) => (
  <Link href={href}>
    <a
      className={`px-3 py-2 rounded-xl font-semibold transition ${
        active
          ? "text-emerald-300 bg-white/10"
          : "text-green-100 hover:text-emerald-300 hover:bg-white/5"
      }`}
    >
      {label}
    </a>
  </Link>
);

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // ✅ State safe (évite erreurs si structure différente)
  const user = useSelector((state) => state?.user?.user ?? null);
  const cartState = useSelector((state) => state?.cart ?? []);
  const cartCount = useMemo(() => {
    // support: cart = []  OU  cart = { cartItems: [] }
    const items = Array.isArray(cartState) ? cartState : cartState?.cartItems ?? [];
    return items.reduce((sum, it) => sum + (it.qty ? Number(it.qty) : 1), 0);
  }, [cartState]);

  const handleLogout = () => {
    setOpenDrawer(false);

    // ✅ Next safe
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("user");
      window.localStorage.removeItem("token");
    }

    dispatch(userLogout());
    enqueueSnackbar("You have successfully logged out", {
      variant: "success",
      autoHideDuration: 2500,
    });

    Router.push("/login");
  };

  const closeDrawer = () => setOpenDrawer(false);

  const isActive = (path) =>
    router.pathname === path || router.pathname.startsWith(path + "/");

  return (
    <header className="sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto flex items-center justify-between h-20 px-4">
        {/* glass background */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gray-900/80 backdrop-blur border-b border-white/10 -z-10" />

        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-400 text-emerald-950 font-black grid place-items-center shadow">
              R
            </div>
            <div className="leading-tight">
              <p className="logo text-2xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-br from-lime-300 to-green-400 bg-clip-text text-transparent">
                Resto
              </p>
              <p className="text-xs text-green-100/70 -mt-1">Fresh • Fast • Secure</p>
            </div>
          </a>
        </Link>

        {/* Desktop links */}
        <div className="flex items-center gap-2">
          {!isMatch && (
            <>
              <NavLink href="/" label="Home" active={isActive("/")} />
              <NavLink href="/foods" label="Explore" active={isActive("/foods")} />

              {user?.role === "admin" && (
                <NavLink href="/admin/foods" label="Dashboard" active={isActive("/admin")} />
              )}

              {user ? (
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-xl font-semibold text-green-100 hover:text-emerald-300 hover:bg-white/5 transition"
                >
                  Logout
                </button>
              ) : (
                <NavLink href="/login" label="Login" active={isActive("/login")} />
              )}
            </>
          )}

          {/* Cart icon */}
          <Link href="/cart">
            <a className="relative ml-1 p-2 rounded-xl hover:bg-white/5 transition text-green-100 hover:text-emerald-300">
              <ShoppingBasket />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-emerald-400 text-emerald-950 font-extrabold flex items-center justify-center rounded-full h-5 min-w-5 px-1">
                  {cartCount}
                </span>
              )}
            </a>
          </Link>

          {/* Mobile menu button */}
          {isMatch && (
            <IconButton onClick={() => setOpenDrawer(true)} size="small">
              <Menu className="text-green-100" />
            </IconButton>
          )}
        </div>

        {/* Mobile Drawer */}
        <Drawer open={openDrawer} onClose={closeDrawer} anchor="top">
          <div className="bg-gray-950 p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <p className="text-green-100 font-extrabold text-lg">Menu</p>
              <IconButton onClick={closeDrawer} size="small">
                <Close className="text-green-100" />
              </IconButton>
            </div>

            <div className="mt-4 grid gap-2">
              <Link href="/">
                <a
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-white/5 hover:bg-white/10 transition"
                  onClick={closeDrawer}
                >
                  <Home className="text-emerald-400" />
                  <span className="text-green-100 font-semibold">Home</span>
                </a>
              </Link>

              <Link href="/foods">
                <a
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-white/5 hover:bg-white/10 transition"
                  onClick={closeDrawer}
                >
                  <Explore className="text-emerald-400" />
                  <span className="text-green-100 font-semibold">Explore</span>
                </a>
              </Link>

              {user?.role === "admin" && (
                <Link href="/admin/foods">
                  <a
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-white/5 hover:bg-white/10 transition"
                    onClick={closeDrawer}
                  >
                    <AdminPanelSettingsOutlined className="text-emerald-400" />
                    <span className="text-green-100 font-semibold">Dashboard</span>
                  </a>
                </Link>
              )}

              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-white/5 hover:bg-white/10 transition text-left"
                >
                  <Logout className="text-emerald-400" />
                  <span className="text-green-100 font-semibold">Logout</span>
                </button>
              ) : (
                <Link href="/login">
                  <a
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-white/5 hover:bg-white/10 transition"
                    onClick={closeDrawer}
                  >
                    <PersonAdd className="text-emerald-400" />
                    <span className="text-green-100 font-semibold">Login</span>
                  </a>
                </Link>
              )}
            </div>
          </div>
        </Drawer>
      </nav>
    </header>
  );
};

export default Navbar;
