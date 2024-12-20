const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const decodeToken = require('../middleware/authMiddleware');

const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })


router.post('/create',upload.single('image'), userController.signUp);
router.post('/login', userController.login);
router.post('/createAddress',decodeToken.decodeUserJWTToken, userController.createAddress);

// router.get('/getProfile', authMiddlware.decodeJWTToken, userController.getProfile)

module.exports = router;
