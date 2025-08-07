// const config = require("../configs/database");
// let mysql = require("mysql");
// let pool = mysql.createPool(config);

// // Handle error dari koneksi pool
// pool.on("error", (err) => {
//   console.error("Database error:", err);
// });

// module.exports = {
//   // Tampilkan halaman register
//   formRegister(req, res) {
//     const fullUrl = req.protocol + "://" + req.get("host") + "/";
//     res.render("register", {
//       url: fullUrl, // untuk digunakan di register.ejs jika perlu
//       colorFlash: req.flash("color"),
//       statusFlash: req.flash("status"),
//       pesanFlash: req.flash("message"),
//     });
//   },

//   // Simpan data register
//   saveRegister(req, res) {
//     const name = req.body.name;
//     const email = req.body.email;
//     const password = req.body.pass;

//     if (name && email && password) {
//       pool.getConnection((err, connection) => {
//         if (err) {
//           console.error("Koneksi DB gagal:", err);
//           req.flash("color", "danger");
//           req.flash("status", "Gagal");
//           req.flash("message", "Koneksi ke database gagal");
//           return res.redirect("/register");
//         }

//         const insertQuery = `INSERT INTO table_admin (name, email, password) VALUES (?, ?, SHA2(?, 512))`;

//         connection.query(
//           insertQuery,
//           [name, email, password],
//           (error, results) => {
//             connection.release();

//             if (error) {
//               console.error("Query error:", error);
//               req.flash("color", "danger");
//               req.flash("status", "Gagal");
//               req.flash(
//                 "message",
//                 "Gagal mendaftarkan user. Mungkin email sudah terdaftar."
//               );
//               return res.redirect("/register");
//             }

//             req.flash("color", "success");
//             req.flash("status", "Yes..");
//             req.flash("message", "Registrasi berhasil");
//             res.redirect("/login");
//           }
//         );
//       });
//     } else {
//       req.flash("color", "warning");
//       req.flash("status", "Perhatian");
//       req.flash("message", "Semua field wajib diisi");
//       res.redirect("/register");
//     }
//   },
// };

const config = require("../configs/database");
let mysql = require("mysql");
let pool = mysql.createPool(config);

// Handle error dari koneksi pool
pool.on("error", (err) => {
  console.error("Database error:", err);
});

module.exports = {
  // Tampilkan halaman register
  formRegister(req, res) {
    const fullUrl = req.protocol + "://" + req.get("host") + "/";

    // ✅ Ambil dulu semua flash ke variabel
    const colorFlash = req.flash("color");
    const statusFlash = req.flash("status");
    const pesanFlash = req.flash("message");

    // ✅ Cetak setelah variabelnya tersedia
    console.log("Flash color:", colorFlash);
    console.log("Flash status:", statusFlash);
    console.log("Flash message:", pesanFlash);

    // ✅ Kirim ke view
    res.render("register", {
      url: fullUrl,
      colorFlash: colorFlash.length > 0 ? colorFlash[0] : null,
      statusFlash: statusFlash.length > 0 ? statusFlash[0] : null,
      pesanFlash: pesanFlash.length > 0 ? pesanFlash[0] : null,
    });
  },

  // Simpan data register
  saveRegister(req, res) {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim();
    const password = req.body.pass?.trim();

    // Validasi input kosong dan minimal panjang password
    if (!name || !email || !password) {
      req.flash("color", "warning");
      req.flash("status", "Perhatian");
      req.flash("message", "Semua field wajib diisi dengan benar");
      return res.redirect("/register");
    }

    if (password.length < 6) {
      req.flash("color", "warning");
      req.flash("status", "Perhatian");
      req.flash("message", "Password minimal 6 karakter");
      return res.redirect("/register");
    }

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Koneksi DB gagal:", err);
        req.flash("color", "danger");
        req.flash("status", "Gagal");
        req.flash("message", "Koneksi ke database gagal");
        return res.redirect("/register");
      }

      const insertQuery = `INSERT INTO table_admin (name, email, password) VALUES (?, ?, SHA2(?, 512))`;

      connection.query(
        insertQuery,
        [name, email, password],
        (error, results) => {
          connection.release();

          if (error) {
            console.error("Query error:", error);

            if (error.code === "ER_DUP_ENTRY") {
              req.flash("color", "danger");
              req.flash("status", "Gagal");
              req.flash("message", "Email sudah terdaftar.");
            } else {
              req.flash("color", "danger");
              req.flash("status", "Gagal");
              req.flash("message", "Terjadi kesalahan saat mendaftar.");
            }

            return res.redirect("/register");
          }

          req.flash("color", "success");
          req.flash("status", "Yes..");
          req.flash("message", "Registrasi berhasil");
          res.redirect("/login");
        }
      );
    });
  },
};
