const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controller/adminController');
const decodeToken = require('../middleware/authMiddleware');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })


// router.post('/create',upload.single('image'), adminController.signUp);
router.post('/login', adminController.adminlogin);
router.post('/addBook', decodeToken.decodeAdminJWTToken,upload.single('image'), adminController.createBook);
router.delete('/deleteBook/:bookId', decodeToken.decodeAdminJWTToken, adminController.deleteBook);
router.get('/getBook/:bookId', decodeToken.decodeAdminJWTToken, adminController.getBookById);
router.post('/updateBook/:bookId', decodeToken.decodeAdminJWTToken,upload.single('image'), adminController.updateBook);




// router.get('/getProfile', authMiddlware.decodeJWTToken, userController.getProfile)

module.exports = router;
