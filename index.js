// Definisi Library yang digunakan
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const flash = require("express-flash");
const app = express();
const methodOverride = require("method-override");

//mengunakan method override
app.use(methodOverride("_method"));

// Definisi lokasi file router
const loginRoutes = require("./src/routes/router-login");
const registerRoutes = require("./src/routes/router-register");
const appRoutes = require("./src/routes/router-app");
const produkRoutes = require("./src/routes/router-produk");
const pengerajinRoutes = require("./src/routes/router-pengerajin");
const motifRoutes = require("./src/routes/router-motif");

// Configurasi dan gunakan library
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware untuk menyajikan file statis (tanpa prefix /public)
app.use(express.static(path.join(__dirname, "public")));
console.log("Serving static files from:", path.join(__dirname, "public"));

// Configurasi library session
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "t@1k0ch3ng",
    name: "secretName",
    cookie: {
      httpOnly: true,
      secure: false, // set true jika pakai HTTPS
      sameSite: "lax", // atau 'strict' tergantung kebutuhan
      maxAge: 1000 * 60 * 60, // 1 jam
    },
  })
);

// index.js
app.use(flash());

// Gunakan routes yang telah didefinisikan
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);
app.use("/", appRoutes);
app.use("/produk", produkRoutes);
app.use("/pengerajin", pengerajinRoutes);
app.use("/motif", motifRoutes);
app.use((req, res, next) => {
  res.locals.url = req.protocol + "://" + req.get("host");
  next();
});

app.use((req, res, next) => {
  res.locals.url = req.protocol + "://" + req.get("host");
  const color = req.flash("color");
  const status = req.flash("status");
  const message = req.flash("message");

  // Hanya assign jika ada isinya
  res.locals.colorFlash = color.length ? color[0] : null;
  res.locals.statusFlash = status.length ? status[0] : null;
  res.locals.pesanFlash = message.length ? message[0] : null;

  // Tampilkan log hanya jika flash ada isinya
  if (color.length || status.length || message.length) {
    console.log("📥 Akses halaman:", req.originalUrl);
    console.log("Flash color:", color);
    console.log("Flash status:", status);
    console.log("Flash message:", message);
  }

  next();
});

// Setting folder views
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");

// Jalankan server
app.listen(3000, () => {
  console.log("Server Berjalan di Port : " + 3000);
});

// kode valid
