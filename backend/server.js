const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { readdirSync } = require("fs");
const connectDatabase = require("./utils/database");
const session = require("express-session");
const path = require("path");

require("dotenv").config();

const app = express();

connectDatabase();

app.use(bodyParser.json());
app.use(cors());

app.use(
  session({
    secret: process.env.JWT_SECRET || "secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60
    }
  })
);

readdirSync("./routes").map((r) => {
  app.use("/api", require(`./routes/${r}`));
});

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('😉 Hello from resto server !');
});

app.get('/image', (req, res) => {
  res.sendFile(path.join(__dirname, "image.png"));
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
