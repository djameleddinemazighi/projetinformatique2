const express = require('express');
const router = express.Router();
const { Roles, user} = require('../models');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');
const { check, validationResult } = require('express-validator');


const authenticateJWT = expressJwt({
    secret: 'wahib',
    algorithms: ['HS256'],
});

const roleRegistrationValidator = [
    check('nom').not().isEmpty().withMessage('Nom est obligatoire'),
];

// Route to create a new role
router.post('/create', authenticateJWT, roleRegistrationValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { nom } = req.body;
        const role = await Roles.create({ nom });
        return res.json({ success: "role ajoutee" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Role creation failed' });
    }
});

router.get('/roles', async (req, res) => {
    try {
        const roles = await Roles.findAll();
        return res.json(roles);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve roles' });
    }
});

router.put('/update/:id',authenticateJWT,roleRegistrationValidator, async (req, res) => {
   const { id } = req.params;
  const email = req.get('email');
  const { nom } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return errors inside an 'errors' array
    }

    const role = await Roles.findByPk(id); // Find the event by its ID

    if (!role) {
      return res.status(404).json({ errors: [{ msg: 'Role not found' }] }); // Return the error inside an 'errors' array
    }

    // Update the event properties
    role.nom = nom;


    await role.save(); // Save the changes

    return res.json({ success: 'Role updated successfully' });
  } catch (error) {
    console.error('Error updating role:', error);
    return res.status(500).json({ errors: [{ msg: 'role update failed' }] }); // Return the error inside an 'errors' array
  }
});

router.delete('/delete/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const email = req.get('email');
    
    try {
        // Fetch the user from the database
        const User = await user.findOne({ where: { email } });

        if (!User || User.selectedRole !== 'staff') {
            return res.status(401).json({ error: 'You do not have the privilege to delete roles' });
        }

        const roleToDelete = await Roles.findOne({ where: { id } });

        if (!roleToDelete) {
            return res.status(404).json({ error: 'Role not found' });
        }

        if (['staff', 'teacher', 'student'].includes(roleToDelete.nom)) {
            return res.status(401).json({ error: 'This role cannot be deleted' });
        }

        // Delete the role
        await Roles.destroy({ where: { id } });

        return res.json({ success: 'Role deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Role deletion failed' });
    }
});

// Add more routes for role operations as needed

module.exports = router;
