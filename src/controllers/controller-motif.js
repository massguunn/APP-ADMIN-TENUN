const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);

pool.on("error", (err) => console.error(err));

module.exports = {
  // ✅ Tampilkan semua motif
  getMotif(req, res) {
    const query = `
      SELECT id_motif, nama, gambar, deskripsi 
      FROM tabel_motif 
      ORDER BY id_motif DESC
    `;
    pool.query(query, (err, results) => {
      if (err) {
        console.error("Gagal ambil data Motif:", err);
        return res.status(500).send("Gagal ambil data Motif");
      }
      res.render("motif", {
        data: results,
        query: req.query,
      });
    });
  },

  // ✅ Tambah motif
  insertMotif(req, res) {
    const { nama, deskripsi } = req.body;
    let gambar = null;

    if (req.file) {
      gambar = "/motif/" + req.file.filename;
    }

    const sql = `
      INSERT INTO tabel_motif (nama, gambar, deskripsi)
      VALUES (?, ?, ?)
    `;
    pool.query(sql, [nama, gambar, deskripsi], (err) => {
      if (err) {
        console.error("Insert motif error:", err);
        return res
          .status(500)
          .json({ status: "error", message: "Gagal menambahkan motif" });
      }
      res.redirect("/motif?success=1");
    });
  },

  // ✅ Update motif
  updateMotif(req, res) {
    const id_motif = req.params.id;
    const { nama, deskripsi } = req.body;

    let sql, values;

    if (req.file) {
      const gambar = "/motif/" + req.file.filename;
      sql = `
        UPDATE tabel_motif 
        SET nama=?, gambar=?, deskripsi=?
        WHERE id_motif=?
      `;
      values = [nama, gambar, deskripsi, id_motif];
    } else {
      sql = `
        UPDATE tabel_motif 
        SET nama=?, deskripsi=?
        WHERE id_motif=?
      `;
      values = [nama, deskripsi, id_motif];
    }

    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error("Update Motif error:", err);
        return res
          .status(500)
          .json({ status: "error", message: "Gagal update Motif" });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ status: "error", message: "Motif tidak ditemukan" });
      }
      res.redirect("/motif?updated=1");
    });
  },

  // ✅ Hapus motif
  deleteMotif(req, res) {
    const id_motif = req.params.id;
    pool.query(
      "DELETE FROM tabel_motif WHERE id_motif=?",
      [id_motif],
      (err, result) => {
        if (err) {
          console.error("Hapus Motif error:", err);
          return res.status(500).send("Error hapus Motif");
        }
        if (result.affectedRows === 0)
          return res.status(404).send("Motif tidak ditemukan");
        res.redirect("/motif?deleted=1");
      }
    );
  },
};
