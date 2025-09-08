const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);

pool.on("error", (err) => console.error(err));

module.exports = {
  home(req, res) {
    const sql = `
    
  SELECT 
    (SELECT COUNT(*) FROM tabel_pengerajin) AS totalPengerajin,
    (SELECT COUNT(*) FROM tabel_motif) AS totalMotif

    `;

    pool.query(sql, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Database error");
      }

      const totalPengerajin = results[0].totalPengerajin;
      const totalMotif = results[0].totalMotif;

      res.render("home", {
        url: req.protocol + "://" + req.get("host") + "/",
        userName: req.session.username,
        totalPengerajin,
        totalMotif,
      });
    });
  },
};
