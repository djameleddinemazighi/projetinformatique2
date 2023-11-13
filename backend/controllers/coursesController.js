// controllers/courseController.js

const express = require('express');
const router = express.Router();
const { Courses, comments } = require('../models');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const {expressjwt: expressJwt} = require('express-jwt');
const session = require('express-session');
const { user } = require('../models'); // Import your Sequelize model for users


const authenticateJWT = expressJwt({
    secret: 'wahib',
    algorithms: ['HS256'],
  });
  
  const coursesaddvalidation = [
  check('nom').not().isEmpty().withMessage('Nom est obligatoire'),
  check('description').not().isEmpty().withMessage('description est obligatoire'),
  ];
const Comentaddvalidation = [
  check('description').not().isEmpty().withMessage('description est obligatoire'),
  ];
  

// Display all courses
router.get('/get', async (req, res) => {
  try {
    const courses = await Courses.findAll();
    return res.json(courses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve courses' });
  }
});

// Add a new course
router.post('/add/:email', authenticateJWT, coursesaddvalidation, async (req, res,next) => {

    const userEmail = req.params.email; // Adjust this based on how you store user information in the request

    try {
      // Fetch user data from the database using the email
      const userData = await user.findOne({ where: { email: userEmail } });

      // Check if the user has the required role
      if (userData && userData.selectedRole.includes('teacher')) {
        // User has the required role, proceed to the next middleware or route handler
         try {
      const { nom, description, email } = req.body;
      console.log(email);
     //add a method to retrieve instructor name
    const newCourse = await Courses.create({ nom, description, addedBy : email });
    return res.json(newCourse);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to add a new course' });
  }
      } else {
        // User doesn't have the required role, send a forbidden response
        res.status(403).json({ error: 'Permission denied' });
      }
    } catch (error) {
      console.error('Error checking role:', error);
      res.status(500).json({ error: 'Internal server error' });
    }

     const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
 
});

router.get('/comments/:id', async (req, res) => {
    console.log(req.params);
    try {

        const courses = await comments.findAll({ where: { course : req.params.id } });
    return res.json(courses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve courses' });
  }
});

router.post('/comments', Comentaddvalidation, async (req, res) => {
     const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
  try {
      const { description , email } = req.body;
     //add a method to retrieve instructor name
    const newCourse = await comments.create({ description, course : req.body.id, email });
    return res.json(newCourse);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to add a new course' });
  }
});
module.exports = router;
