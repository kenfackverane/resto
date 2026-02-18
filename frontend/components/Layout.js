import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userLogin } from "../redux/slices/userSlice";
import Footer from "./Footer";
import Navbar from "./navbar/Navbar";

const Layout = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // ✅ Next.js safe (évite SSR crash)
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem("user");
      if (!raw) return;

      const user = JSON.parse(raw);
      if (!user) return;

      dispatch(userLogin(user));
    } catch (err) {
      // ✅ si JSON cassé, on nettoie et on évite crash
      window.localStorage.removeItem("user");
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
