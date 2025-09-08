const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);

pool.on("error", (err) => console.error(err));

module.exports = {
  // ✅ Tampilkan semua pengerajin
  getPengerajin(req, res) {
    const query = `
      SELECT id_pengerajin, nama_toko, nama_pemilik, nomer_hp, deskripsi, alamat, gambar, maps, latitude, longitude
      FROM tabel_pengerajin
      ORDER BY id_pengerajin DESC
    `;
    pool.query(query, (err, results) => {
      if (err) {
        console.error("Gagal ambil data pengerajin:", err);
        return res.status(500).send("Gagal ambil data pengerajin");
      }
      res.render("pengerajin", {
        data: results,
        query: req.query,
      });
    });
  },

  // ✅ Tambah pengerajin
  insertPengerajin(req, res) {
    const {
      nama_toko,
      nama_pemilik,
      nomer_hp,
      deskripsi,
      alamat,
      maps,
      latitude,
      longitude,
    } = req.body;
    let gambar = null;

    if (req.file) {
      gambar = "/uploads/" + req.file.filename;
    }

    const sql = `
      INSERT INTO tabel_pengerajin 
      (nama_toko, nama_pemilik, nomer_hp, deskripsi, alamat, gambar, maps, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    pool.query(
      sql,
      [
        nama_toko,
        nama_pemilik,
        nomer_hp,
        deskripsi,
        alamat,
        gambar,
        maps,
        latitude,
        longitude,
      ],
      (err) => {
        if (err) {
          console.error("Insert pengerajin error:", err);
          return res
            .status(500)
            .json({ status: "error", message: "Gagal menambahkan pengerajin" });
        }
        res.redirect("/pengerajin?success=1");
      }
    );
  },

  // ✅ Update pengerajin
  updatePengerajin(req, res) {
    const id_pengerajin = req.params.id;
    const body = req.body || {}; // fallback biar gak undefined

    const {
      nama_toko,
      nama_pemilik,
      nomer_hp,
      deskripsi,
      alamat,
      maps,
      latitude,
      longitude,
    } = body;

    let sql, values;

    if (req.file) {
      const gambar = "/uploads/" + req.file.filename;
      sql = `
      UPDATE tabel_pengerajin 
      SET nama_toko=?, nama_pemilik=?, nomer_hp=?, deskripsi=?, alamat=?, gambar=?, maps=?, latitude=?, longitude=?
      WHERE id_pengerajin=?
    `;
      values = [
        nama_toko,
        nama_pemilik,
        nomer_hp,
        deskripsi,
        alamat,
        gambar,
        maps,
        latitude,
        longitude,
        id_pengerajin,
      ];
    } else {
      sql = `
      UPDATE tabel_pengerajin 
      SET nama_toko=?, nama_pemilik=?, nomer_hp=?, deskripsi=?, alamat=?, maps=?, latitude=?, longitude=?
      WHERE id_pengerajin=?
    `;
      values = [
        nama_toko,
        nama_pemilik,
        nomer_hp,
        deskripsi,
        alamat,
        maps,
        latitude,
        longitude,
        id_pengerajin,
      ];
    }

    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error("Update pengerajin error:", err);
        return res.status(500).send("Gagal update pengerajin");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("Pengerajin tidak ditemukan");
      }
      res.redirect("/pengerajin?updated=1");
    });
  },

  // ✅ Hapus pengerajin
  deletePengerajin(req, res) {
    const id_pengerajin = req.params.id;
    pool.query(
      "DELETE FROM tabel_pengerajin WHERE id_pengerajin=?",
      [id_pengerajin],
      (err, result) => {
        if (err) {
          console.error("Hapus pengerajin error:", err);
          return res.status(500).send("Error hapus pengerajin");
        }
        if (result.affectedRows === 0)
          return res.status(404).send("Pengerajin tidak ditemukan");
        res.redirect("/pengerajin?deleted=1");
      }
    );
  },
};
