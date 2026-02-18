import React from "react";
import Link from "next/link";

const Home = () => {
  return (
    <main className="relative overflow-hidden">
      {/* background glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-green-400/10 blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 py-10 min-h-[83vh] grid md:grid-cols-2 gap-10 items-center">
        {/* LEFT */}
        <section className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-white/5 px-4 py-2 text-emerald-200 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Fresh • Healthy • Fast delivery
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-emerald-500 to-green-200 bg-clip-text text-transparent">
              Say goodbye to your hunger
            </span>
            <span className="text-green-50">,</span>
            <br />
            <span className="text-green-50">eat better today.</span>
          </h1>

          <p className="mt-5 text-green-100/80 text-lg md:text-xl leading-relaxed">
            Order healthy and tasty food online wherever and whenever from{" "}
            <span className="text-green-300 font-bold text-2xl md:text-3xl ml-1">
              Resto😋
            </span>
            . Simple, quick and delicious.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/foods">
              <button className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-bold text-emerald-950 shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02] hover:bg-emerald-300 active:scale-[0.98]">
                Order Now
                <span className="transition group-hover:translate-x-0.5">→</span>
              </button>
            </Link>

            <Link href="/register">
              <button className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-green-50 backdrop-blur transition hover:bg-white/10">
                Create account
              </button>
            </Link>
          </div>

          {/* quick stats */}
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
              <p className="text-green-50 font-extrabold text-lg">15–25m</p>
              <p className="text-green-100/70 text-sm">Delivery</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
              <p className="text-green-50 font-extrabold text-lg">100+</p>
              <p className="text-green-100/70 text-sm">Meals</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
              <p className="text-green-50 font-extrabold text-lg">4.8★</p>
              <p className="text-green-100/70 text-sm">Reviews</p>
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <section className="relative flex justify-center items-center">
          {/* card */}
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur">
            {/* badge */}
            <div className="absolute -top-3 left-6 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-emerald-950 shadow">
              Today’s Pick
            </div>

            {/* image wrapper */}
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="http://localhost:5000/image"
                alt="food"
                className="h-72 w-full object-cover md:h-[420px]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/food-default.jpg"; // mets une image dans /public
                }}
              />
              {/* overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

              {/* bottom info */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                <div className="rounded-2xl bg-black/30 px-4 py-3 backdrop-blur">
                  <p className="text-green-50 font-extrabold">Green Bowl</p>
                  <p className="text-green-100/80 text-sm">
                    Fresh veggies • Light sauce
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-400 px-4 py-3 font-extrabold text-emerald-950 shadow">
                  €6.90
                </div>
              </div>
            </div>

            {/* small row */}
            <div className="mt-4 flex items-center justify-between text-sm text-green-100/70">
              <span>Free delivery over €15</span>
              <span className="text-green-200">Secure checkout</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
