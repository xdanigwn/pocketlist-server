const router = require("express").Router();
const apiController = require("../controllers/apiController");
// const { upload } = require('../middlewares/multer');
//endpoint login
router.get("/overview/:dateFrom/:dateTo", apiController.overview);
router.get("/accountdtl/:id", apiController.accountDetail); //id = id account
router.get("/accountdd/:id", apiController.accountDropDown); //id = id account yg tidak ses dengan acc yg dipilih
router.get("/balanceinfo/:id", apiController.balanceInfo); //id = id user
router.get("/personalincdtl/:id/:dateFrom/:dateTo", apiController.personalIncomeDetail); //id = id user
router.get("/personalexpdtl/:id/:dateFrom/:dateTo", apiController.personalExpenseDetail); //id = id user
router.get("/reportexpctg/:id", apiController.reportExpenseCategory); //id = id user
router.get("/reportincctg/:id", apiController.reportIncomeCategory); //id = id user
router.post("/addtrans", apiController.addTrans);
router.get("/deltrans/:id", apiController.delTrans);

module.exports = router;