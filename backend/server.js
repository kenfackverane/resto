// backend/server.js
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { readdirSync } = require("fs");
const session = require("express-session");

const connectDatabase = require("./utils/database");

const app = express();

/* ✅ Debug env (très utile) */
console.log("✅ ENV FILE:", path.join(__dirname, ".env"));
console.log("✅ PORT:", process.env.PORT);
console.log(
  "✅ MONGO_URI starts with:",
  (process.env.MONGO_URI || "").slice(0, 45)
);

/* ✅ Connect DB */
connectDatabase();

/* ✅ Middlewares */
app.use(bodyParser.json());
const cors = require("cors");

app.use(cors({
  origin: "https://resto-pxg7-git-main-kenfackveranes-projects.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors()); // handle preflight requests


app.use(
  session({
    secret: process.env.JWT_SECRET || "secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

/* ✅ Routes auto */
readdirSync(path.join(__dirname, "routes")).forEach((r) => {
  app.use("/api", require(`./routes/${r}`));
});

/* ✅ Test route */
app.get("/", (req, res) => {
  res.send("😉 Hello from resto server !");
});

/* ✅ Start server */
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`✅ Server is running on port: ${port}`);
});