const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);

pool.on("error", (err) => console.error(err));

module.exports = {
  // ✅ Ambil semua produk (join dengan pengerajin)
  getProduk(req, res) {
    const query = `
      SELECT p.id_produk, p.nama, p.gambar, p.harga,
             r.id_pengerajin, r.nama_toko, r.nama_pemilik, r.nomer_hp, r.alamat, r.maps
      FROM tabel_produk p
      JOIN tabel_pengerajin r ON p.id_pengerajin = r.id_pengerajin
      ORDER BY p.id_produk DESC
    `;
    pool.query(query, (err, results) => {
      if (err) {
        console.error("Gagal ambil data produk:", err);
        return res.status(500).send("Gagal ambil data produk");
      }

      // Ambil juga data pengerajin untuk dropdown
      pool.query(
        "SELECT id_pengerajin, nama_toko FROM tabel_pengerajin",
        (err2, pengerajin) => {
          if (err2) {
            console.error("Gagal ambil data pengerajin:", err2);
            return res.status(500).send("Gagal ambil data pengerajin");
          }

          res.render("produk", {
            data: results,
            pengerajin, // 🔹 biar bisa dipakai di <select>
            query: req.query,
          });
        }
      );
    });
  },

  // ✅ Tambah produk
  insertProduk(req, res) {
    const { id_pengerajin, nama, harga } = req.body;
    let gambar = null;

    if (req.file) {
      gambar = "/produk/" + req.file.filename;
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "Gambar harus diupload" });
    }

    const sql = `
      INSERT INTO tabel_produk (id_pengerajin, nama, gambar, harga)
      VALUES (?, ?, ?, ?)
    `;
    pool.query(sql, [id_pengerajin, nama, gambar, harga], (err) => {
      if (err) {
        console.error("Insert produk error:", err);
        return res
          .status(500)
          .json({ status: "error", message: "Gagal menambahkan produk" });
      }
      res.redirect("/produk?success=1");
    });
  },

  // ✅ Update produk
  updateProduk(req, res) {
    const id_produk = req.params.id;
    const { id_pengerajin, nama, harga } = req.body;

    let sql, values;

    if (req.file) {
      // Jika upload gambar baru
      const gambar = "/produk/" + req.file.filename;
      sql = `
        UPDATE tabel_produk 
        SET id_pengerajin=?, nama=?, gambar=?, harga=?
        WHERE id_produk=?
      `;
      values = [id_pengerajin, nama, gambar, harga, id_produk];
    } else {
      // Jika tanpa upload gambar
      sql = `
        UPDATE tabel_produk 
        SET id_pengerajin=?, nama=?, harga=?
        WHERE id_produk=?
      `;
      values = [id_pengerajin, nama, harga, id_produk];
    }

    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error("Update produk error:", err);
        return res
          .status(500)
          .json({ status: "error", message: "Gagal update produk" });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ status: "error", message: "Produk tidak ditemukan" });
      }
      res.redirect("/produk?updated=1");
    });
  },

  // ✅ Hapus produk
  deleteProduk(req, res) {
    const id_produk = req.params.id;
    pool.query(
      "DELETE FROM tabel_produk WHERE id_produk=?",
      [id_produk],
      (err, result) => {
        if (err) {
          console.error("Hapus produk error:", err);
          return res.status(500).send("Error hapus produk");
        }
        if (result.affectedRows === 0)
          return res.status(404).send("Produk tidak ditemukan");
        res.redirect("/produk?deleted=1");
      }
    );
  },
};
