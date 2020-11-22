const router = require("express").Router();
const apiController = require("../controllers/apiController");
// const { upload } = require('../middlewares/multer');
//endpoint login
router.get("/overview", apiController.overview);
router.post("/addtrans", apiController.addTrans);

module.exports = router;
