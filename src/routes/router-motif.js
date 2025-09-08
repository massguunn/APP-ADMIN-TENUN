const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const motifController = require("../controllers/controller-motif");

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/motif/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Routing motif
router.get("/", motifController.getMotif);
router.post("/tambah", upload.single("gambar"), motifController.insertMotif);
router.post(
  "/update/:id",
  upload.single("gambar"),
  motifController.updateMotif
);
router.get("/hapus/:id", motifController.deleteMotif);

module.exports = router;
