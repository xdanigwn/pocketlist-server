const router = require("express").Router();
const apiController = require("../controllers/apiController");
// const { upload } = require('../middlewares/multer');
//endpoint login
router.get("/overview", apiController.overview);
router.get("/accountdtl/:id", apiController.accountDetail);
router.get("/accountdd/:id", apiController.accountDropDown);
router.post("/addtrans", apiController.addTrans);
router.get("/deltrans/:id", apiController.delTrans);

module.exports = router;