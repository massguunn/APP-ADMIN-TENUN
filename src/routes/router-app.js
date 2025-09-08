const router = require("express").Router();
const homeController = require("../controllers").home;
const verifyUser = require("../configs/verify");
// const alatMusikController = require("../controllers").alatMusik;

router.get("/", verifyUser.isLogin, homeController.home);

// //kode untuk crud alat musik
// router.get("/alatMusik", verifyUser.isLogin, alatMusikController.showAlatMusik);

module.exports = router;
