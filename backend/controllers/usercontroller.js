// controllers/userController.js

const express = require('express');
const router = express.Router();
const { user } = require('../models');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const {expressjwt: expressJwt} = require('express-jwt');
const session = require('express-session');

const authenticateJWT = expressJwt({
    secret: 'wahib',
    algorithms: ['HS256'],
  });
  
  // Session middleware
  router.use(
    session({
      secret: 'wahib',
      resave: false,
      saveUninitialized: true,
    })
  );

const userRegistrationValidator = [
  check('nom').not().isEmpty().withMessage('Nom est obligatoire'),
  check('prenom').not().isEmpty().withMessage('Prenom est obligatoire'),
    check('naissance').not().isEmpty().withMessage('date de naissance est obligatoire'),
    check('telephone').not().isEmpty().withMessage('numero de telephone est obligatoire').isMobilePhone(),
    check('email').isEmail().withMessage('addresse email invalide'),
  check('mot_de_passe').isLength({ min: 6 }).withMessage('mot de passe doit au minimum avoir 6 characteres'),
];

// Route to create a new user
router.post('/register', userRegistrationValidator, async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
    }
  emailch = req.body.email;
    const users = await user.findOne({ where: { email : emailch } });
  if (users) {
   return res.json({ success: false, error: 'Email existe deja' });
    } else {

      try {
        const {
      nom,
      prenom,
      naissance,
      photo,
      telephone,
      email,
          mot_de_passe,
      selectedRole
    } = req.body;

      const push = await user.create({
      nom,
      prenom,
      naissance,
      photo,
      telephone,
      email,
        mot_de_passe,
      selectedRole
    });

        return res.json({success:"Utilistaeur ajoutee"});
        
        } catch (error) {
    // Check if the error is due to a duplicate email constraint violation
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    } else {
      console.error(error);
      return res.status(500).json({ success: false, error: 'User registration failed' });
    }
  }
      
    }
});

// Route to get all users
router.get('/users',authenticateJWT, async (req, res) => {
  try {
    const users = await user.findAll();
    return res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// Route for user login
router.post('/login', async (req, res) => {
    const { email, mot_de_passe } = req.body;
  
    try {
      // Check user credentials in the database
      const users = await user.findOne({ where: { email } });
  
      if (!users || users.mot_de_passe !== mot_de_passe) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
  
      // Create a JWT token
      const token = jwt.sign({ email }, 'wahib', { expiresIn: '72h' });
  
      // Set the token in the session
      req.session.token = token;
  
      res.json({ message: 'Login successful', token , email });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Login failed' });
    }
  });
  
  // Protected route example
  router.get('/protected-route', authenticateJWT, (req, res) => {
    res.json({ message: 'This is a protected route' });
  });

module.exports = router;
