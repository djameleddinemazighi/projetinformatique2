const express = require('express');
const router = express.Router();
const { Roles } = require('../models');
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

// Add more routes for role operations as needed

module.exports = router;
