const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const roleController = require('../controllers/roleController');
const coursesController = require('../controllers/coursesController');

router.use('/user', userController);
router.use('/role', roleController);
router.use('/courses', coursesController);

module.exports = router;