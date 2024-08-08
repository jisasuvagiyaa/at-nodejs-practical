const express = require("express");
const adminController = require("../controllers/adminController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.get('/', adminController.index);
router.get('/login', adminController.login);
router.post('/signup', adminController.signUp);
router.post('/login', adminController.Login);
router.get('/admins', authenticateToken, adminController.getAdmins);
router.post('/change-password', authenticateToken, adminController.changePassword);
router.post('/logout', adminController.logout); 

module.exports = router;
