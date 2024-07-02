const express = require('express');
userController = require('../controllers/userController')

const router = express.Router();

router.post('/updateMyInformation', userController.uploadUserImage, userController.resizeImage)


module.exports = router;