const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const roleController = require('../controllers/roleController');
const coursesController = require('../controllers/coursesController');
const eventsController = require('../controllers/eventsController');

router.use('/user', userController);
router.use('/role', roleController);
router.use('/courses', coursesController);
router.use('/events', eventsController);

module.exports = router;