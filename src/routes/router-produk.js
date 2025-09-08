const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const produkController = require("../controllers/controller-produk");

// Konfigurasi upload gambar pakai multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/produk/"); // folder penyimpanan
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Routing produk
router.get("/", produkController.getProduk);
router.post("/tambah", upload.single("gambar"), produkController.insertProduk);
router.post(
  "/update/:id",
  upload.single("gambar"),
  produkController.updateProduk
);
router.get("/hapus/:id", produkController.deleteProduk);

module.exports = router;
