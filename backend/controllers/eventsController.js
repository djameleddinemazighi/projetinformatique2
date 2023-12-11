// controllers/courseController.js

const express = require('express');
const router = express.Router();
const { events } = require('../models');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const {expressjwt: expressJwt} = require('express-jwt');
const session = require('express-session');
const { user } = require('../models'); // Import your Sequelize model for users


const authenticateJWT = expressJwt({
    secret: 'wahib',
    algorithms: ['HS256'],
  });
  
  const eventaddvalidation = [
      check('name').not().isEmpty().withMessage('Nom est obligatoire'),
      check('location').not().isEmpty().withMessage('Nom est obligatoire'),
  check('description').not().isEmpty().withMessage('description est obligatoire'),
  ];

const verifyupdatefields = [
    check('name').not().isEmpty().withMessage('Nom est obligatoire'),
    check('location').not().isEmpty().withMessage('localisation est obligatoire'),
    check('description').not().isEmpty().withMessage('description est obligatoire'),
];

  

router.get('/', async (req, res) => {
  try {
    const eventsF = await events.findAll();
    return res.json(eventsF);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve events' });
  }
});

router.put('/update/:id', authenticateJWT, verifyupdatefields, async (req, res) => {
  const { id } = req.params;
  const email = req.get('email');
  const { name, location, description } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return errors inside an 'errors' array
    }

    const event = await events.findByPk(id); // Find the event by its ID

    if (!event) {
      return res.status(404).json({ errors: [{ msg: 'Event not found' }] }); // Return the error inside an 'errors' array
    }

    // Update the event properties
    event.name = name;
    event.location = location;
    event.description = description;

    await event.save(); // Save the changes

    return res.json({ success: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    return res.status(500).json({ errors: [{ msg: 'Event update failed' }] }); // Return the error inside an 'errors' array
  }
});


router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
    const email = req.get('email'); 
    
    try {
        // Fetch the user from the database
        const User = await user.findOne({ where: { email } });

        if (!User || User.selectedRole !== 'staff') {
            return res.status(401).json({ error: 'You do not have the privilege to delete Events' });
        }

        const EventToDelete = await events.findOne({ where: { id } });

        if (!EventToDelete) {
            return res.status(404).json({ error: 'event not found' });
        }

        // Delete the role
        await events.destroy({ where: { id } });

        return res.json({ success: 'event deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'event deletion failed' });
    }
});

router.post('/add', authenticateJWT, eventaddvalidation, async (req, res) => {
    const email = req.get('email');
    console.log(email);
    const { name, location, description } = req.body;
    
    const userData = await user.findOne({ where: { email } });
    
 const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
      // Check if the user has the required role
    if (userData && userData.selectedRole.includes('teacher') || userData.selectedRole.includes('staff')) {

        try {
            // Fetch user data from the database using the email
            const userData = await user.findOne({ where: { email } });

            // Check if the user has the required role
            if (userData && userData.selectedRole.includes('staff')) {
                // User has the required role, proceed to the next middleware or route handler
                try {
                    //add a method to retrieve instructor name
                    const newEvent = await events.create({ name, location, description });
                    return res.json(newEvent);
                } catch (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Failed to add a new event' });
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
          
    } else {
         res.status(403).json({ error: 'Permission denied' });
    }

});


module.exports = router;