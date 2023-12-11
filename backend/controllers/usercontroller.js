// controllers/userController.js

const express = require('express');
const router = express.Router();
const { user,groupes } = require('../models');
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
      groupe,
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
      groupe,
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
      req.session.email = email;
      role = users.selectedRole;
  
      res.json({ message: 'Login successful', token , email, role});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Login failed' });
    }
  });
  
  // Protected route example
  router.post('/groupes/create',authenticateJWT, async (req, res) => {
  const { name } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
         
        const groupe = await groupes.create({ name });
        return res.json({ success: "Groupe ajoutee" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Groupe creation failed' });
    }

  });

router.delete('/groupes/delete/:id',authenticateJWT, async (req, res) => {

  const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
         
        const groupe = await groupes.destroy({where: {id}});
        return res.json({ success: "Groupe supprimee" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Groupe deletion failed' });
    }

  });


  router.get('/groupes',  async (req, res) => {
    try {
        const roles = await groupes.findAll();
        return res.json(roles);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve groupes' });
    }
  });

 const groupeUpdateValidation = [
  check('name').not().isEmpty().withMessage('Nom est obligatoire'),
];

router.put('/groupes/update/:id', authenticateJWT, groupeUpdateValidation, async (req, res) => {
  const email = req.get('email');
  const { id } = req.params;
  const { name } = req.body;

  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const users = await user.findOne({ where: { email } });

    if (!users || users.selectedRole !== 'staff') {
      return res.status(401).json({ error: 'You do not have the privilege to update groups' });
    }

    const group = await groupes.findByPk(id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Update the group properties
    group.name = name;

    await group.save(); // Save the changes

    return res.json({ success: 'Group updated successfully' });
  } catch (error) {
    console.error('Error updating group:', error);
    return res.status(500).json({ error: 'Group update failed' });
  }
});

const UserUpdateValidation = [
  check('nom').not().isEmpty().withMessage('Nom est obligatoire'),
  check('prenom').not().isEmpty().withMessage('Prenom est obligatoire'),
    check('telephone').not().isEmpty().withMessage('numero de telephone est obligatoire').isMobilePhone(),
    check('email').isEmail().withMessage('addresse email invalide'),
];

router.put('/update/:id', authenticateJWT, UserUpdateValidation, async (req, res) => {
  const { id } = req.params;
  const { nom,prenom,telephone,email } = req.body;

  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const users = await user.findOne({ where: { email } });

    if (!users || users.selectedRole !== 'staff') {
      return res.status(401).json({ error: 'You do not have the privilege to update users' });
    }

    const userUpdate = await user.findByPk(id);

    if (!userUpdate) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the group properties
    userUpdate.nom = nom;
    userUpdate.prenom = prenom;
    userUpdate.email = email;
    userUpdate.telephone = telephone;

    await userUpdate.save(); // Save the changes

    return res.json({ success: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating User:', error);
    return res.status(500).json({ error: 'User update failed' });
  }
});

router.get('/classe', async (req, res) => {
  const  email  = req.get("email");
 
    try {
      const thisuser = await user.findOne({ where: { email } });
        const classe = await user.findAll({where : {groupe: thisuser.groupe }});
        return res.json(classe);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve groupes' });
    }
});

router.delete('/delete/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const email = req.get('email'); // Always declare variables using 'const' or 'let'
    
    try {
        // Fetch the user from the database
        const User = await user.findOne({ where: { email } });

        if (!User || User.selectedRole !== 'staff') {
            return res.status(401).json({ error: 'You do not have the privilege to delete users' });
        }

        const userToDelete = await user.findOne({ where: { id } });

        if (!userToDelete) {
            return res.status(404).json({ error: 'Role not found' });
        }

        if (['admin@univ.com'].includes(userToDelete.email)) {
            return res.status(401).json({ error: 'This Admin cannot be deleted' });
        }

        // Delete the role
        await user.destroy({ where: { id } });

        return res.json({ success: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'User deletion failed' });
    }
});


module.exports = router;
