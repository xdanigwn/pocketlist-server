const router = require("express").Router();
const adminController = require("../controllers/adminController");
const { upload } = require('../middlewares/multer')
const auth = require('../middlewares/auth')
//endpoint login
router.get('/login', adminController.viewLogin);
router.post('/login', adminController.actionLogin);
router.use(auth);
router.get('/logout', adminController.actionLogout);
router.get('/dashboard', adminController.viewDashboard);
//endpoint category
router.get('/category', adminController.viewCategory);
router.post('/category', upload, adminController.addCategory);
router.put('/category', upload, adminController.editCategory);
router.delete('/category/:id', adminController.deleteCategory);
//endpoint user
router.get('/user', adminController.viewUser);
router.post('/user', adminController.addUser);
router.put('/user', adminController.editUser);
router.delete('/user/:id', adminController.deleteUser);
//endpoint account
router.get('/account', adminController.viewAccount);
router.post('/account', upload, adminController.addAccount);
router.put('/account', upload, adminController.editAccount);
router.delete('/account/:id', adminController.deleteAccount);
//endpoint account
router.get('/trans', adminController.viewTrans);
router.delete('/trans/:id', adminController.deleteTrans);

module.exports = router;
