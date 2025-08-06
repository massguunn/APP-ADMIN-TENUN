const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);

// Cek koneksi ke database saat inisialisasi controller
pool.getConnection((err, connection) => {
  if (err) {
    console.log("❌ Gagal koneksi ke database saat inisialisasi:", err.message);
  } else {
    console.log("✅ Sukses koneksi ke database saat inisialisasi");
    connection.release();
  }
});

module.exports = {
  // GET /login
  login(req, res) {
    if (req.session.loggedin) {
      console.log("🔁 User sudah login, redirect ke /home");
      return res.redirect("/");
    }

    const fullUrl = req.protocol + "://" + req.get("host") + "/";
    console.log("📥 Akses halaman login, full URL:", fullUrl);

    res.render("login", {
      url: fullUrl,
    });
  },

  // POST /login
  loginAuth(req, res) {
    const { email, password } = req.body;
    console.log("📨 Login attempt:", { email, password });

    if (!email || !password) {
      console.log("⚠️ Email atau password kosong");
      req.flash("color", "warning");
      req.flash("status", "Perhatian");
      req.flash("message", "Email dan password wajib diisi");
      return res.redirect("/login");
    }

    pool.getConnection((err, connection) => {
      if (err) {
        console.log("❌ Gagal konek database:", err.message);
        req.flash("color", "danger");
        req.flash("status", "Error");
        req.flash("message", "Koneksi database gagal.");
        return res.redirect("/login");
      }

      const sqlCheckEmail = "SELECT * FROM table_admin WHERE email = ?";
      console.log("🔍 Cek email:", email);

      connection.query(sqlCheckEmail, [email], (err, results) => {
        if (err) {
          console.log("❌ Error query cek email:", err.message);
          connection.release();
          req.flash("color", "danger");
          req.flash("status", "Error");
          req.flash("message", "Terjadi kesalahan pada server.");
          return res.redirect("/login");
        }

        if (results.length === 0) {
          console.log("❌ Email tidak ditemukan:", email);
          connection.release();
          req.flash("color", "danger");
          req.flash("status", "Gagal");
          req.flash("message", "Email tidak terdaftar");
          return res.redirect("/login");
        }

        // Email ditemukan, verifikasi password
        console.log("✅ Email ditemukan, verifikasi password...");

        const sqlCheckPassword = `
          SELECT * FROM table_admin 
          WHERE email = ? AND password = SHA2(?, 512)
        `;
        connection.query(
          sqlCheckPassword,
          [email, password],
          (err2, result2) => {
            connection.release();

            if (err2) {
              console.log("❌ Error saat verifikasi password:", err2.message);
              req.flash("color", "danger");
              req.flash("status", "Error");
              req.flash(
                "message",
                "Terjadi kesalahan saat verifikasi password."
              );
              return res.redirect("/login");
            }

            if (result2.length > 0) {
              console.log("✅ Login berhasil:", result2[0].name);
              req.session.loggedin = true;
              req.session.userid = result2[0].id;
              req.session.username = result2[0].name;
              return res.redirect("/");
            } else {
              console.log("❌ Password salah untuk email:", email);
              req.flash("color", "danger");
              req.flash("status", "Gagal");
              req.flash("message", "Password salah");
              return res.redirect("/login");
            }
          }
        );
      });
    });
  },

  //GET /logout
  logout(req, res) {
    console.log("🔚 User logout dipanggil");
    req.session.destroy((err) => {
      if (err) {
        console.error("❌ Error saat logout:", err.message);
      } else {
        console.log("✅ Logout sukses, session dihapus");
      }
      res.clearCookie("secretname");
      res.redirect("/login");
    });
  },
};

//   logout(req, res) {
//     req.session.destroy((err) => {
//       if (err) {
//         console.error(err);
//         return;
//       }
//       res.clearCookie("secretname");
//       res.redirect("/login");
//     });
//   },
// };
