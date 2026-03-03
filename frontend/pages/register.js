import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Loading from "../components/Loading";
import Router from "next/router";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cf_password, setCf_password] = useState("");
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const userState = useSelector((state) => state.user);
  const user = userState?.user ?? null;

  useEffect(() => {
    if (user) Router.push("/");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // petit check rapide côté front
    if (!name || !email || !password || !cf_password) {
      enqueueSnackbar("Please fill in all fields.", { variant: "error" });
      return;
    }
    if (password !== cf_password) {
      enqueueSnackbar("Passwords do not match.", { variant: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("https://restoback-lime.vercel.app/api/register", {
        name,
        email,
        password,
        cf_password,
      });

      enqueueSnackbar(res.data?.message || "Registered successfully", {
        variant: "success",
        autoHideDuration: 3000,
      });

      setName("");
      setEmail("");
      setPassword("");
      setCf_password("");

      Router.push("/login");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";
      enqueueSnackbar(msg, { variant: "error", autoHideDuration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}

      <div className="max-w-6xl mx-auto min-h-[85vh] grid md:grid-cols-2">
        <div className="h-full flex justify-center items-center flex-col">
          <h1 className="text-3xl tracking-wider font-bold text-green-100 mb-5">
            REGISTER
          </h1>

          <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 font-semibold outline-none rounded-lg bg-transparent w-64 text-center placeholder:text-sm border-2 border-green-400"
              type="text"
              placeholder="Your name"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 font-semibold outline-none rounded-lg bg-transparent w-64 text-center placeholder:text-sm border-2 border-green-400"
              type="email"
              placeholder="Your Email address"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 font-semibold outline-none rounded-lg bg-transparent w-64 text-center placeholder:text-sm border-2 border-green-400"
              type="password"
              placeholder="New password"
            />
            <input
              value={cf_password}
              onChange={(e) => setCf_password(e.target.value)}
              className="p-3 font-semibold outline-none rounded-lg bg-transparent w-64 text-center placeholder:text-sm border-2 border-green-400"
              type="password"
              placeholder="Confirm password"
            />

            <button
              className="bg-green-400 text-white hover:bg-green-100 hover:text-green-600 tracking-widest transition duration-300 ease-in-out font-bold p-3 rounded-lg cursor-pointer disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              Register
            </button>
          </form>

          <p className="mt-3">
            Already have an account?
            <Link href="/login" legacyBehavior>
              <a className="text-green-500 font-semibold ml-2">Login Now</a>
            </Link>
          </p>
        </div>

        <div className="hidden md:flex h-full justify-center items-center">
          <img
            src="https://res.cloudinary.com/jamesmarycloud/image/upload/v1653201598/register-page_koqqzb.png"
            className="h-[400px]"
            alt="register"
          />
        </div>
      </div>
    </>
  );
};

export default Register;