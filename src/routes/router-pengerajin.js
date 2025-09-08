const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const pengerajinController = require("../controllers/controller-pengerajin");

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // folder penyimpanan
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Routing pengerajin
router.get("/", pengerajinController.getPengerajin);

// ✅ Tambah pakai upload.single("gambar")
router.post(
  "/tambah",
  upload.single("gambar"),
  pengerajinController.insertPengerajin
);

// ✅ Update juga pakai upload.single("gambar")
router.post(
  "/update/:id",
  upload.single("gambar"),
  pengerajinController.updatePengerajin
);

router.get("/hapus/:id", pengerajinController.deletePengerajin);

module.exports = router;
