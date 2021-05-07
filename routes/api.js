const router = require("express").Router();
const apiController = require("../controllers/apiController");
const authAPI = require('../middlewares/authAPI')
// const { upload } = require('../middlewares/multer');
//endpoint login

router.get('/authcheck', apiController.authCheck);
router.post('/login' , apiController.actLogin);
router.get('/logout', apiController.actLogout);

// router.use(authAPI);

router.get("/overview/:id/:dateFrom/:dateTo", apiController.overview);
router.get("/accountdtl/:id", apiController.accountDetail); //id = id account
router.get("/accountdd/:id/:idAcc", apiController.accountDropDown); //idAcc = id account yg tidak ses dengan acc yg dipilih
router.get("/balanceinfo/:id", apiController.balanceInfo); //id = id user
router.get("/personalincdtl/:id/:dateFrom/:dateTo", apiController.personalIncomeDetail); //id = id user
router.get("/personalexpdtl/:id/:dateFrom/:dateTo", apiController.personalExpenseDetail); //id = id user
router.get("/reportexpctg/:id", apiController.reportExpenseCategory); //id = id user
router.get("/reportincctg/:id", apiController.reportIncomeCategory); //id = id user
router.post("/addtrans", apiController.addTrans);
router.get("/deltrans/:id", apiController.delTrans);

module.exports = router;