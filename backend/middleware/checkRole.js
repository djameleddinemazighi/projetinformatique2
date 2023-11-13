// middleware/checkRole.js

const { user } = require('../models'); // Import your Sequelize model for users

module.exports = async function checkRole(requiredRole,email) {
  return async function (req, res, next) {
    // Assuming you have a user object attached to the request, which you can set during authentication
    const userEmail = email; // Adjust this based on how you store user information in the request

    try {
      // Fetch user data from the database using the email
      const userData = await user.findOne({ where: { email: userEmail } });

      // Check if the user has the required role
      if (userData && userData.selectedRole.includes(requiredRole)) {
        // User has the required role, proceed to the next middleware or route handler
        next();
      } else {
        // User doesn't have the required role, send a forbidden response
        res.status(403).json({ error: 'Permission denied' });
      }
    } catch (error) {
      console.error('Error checking role:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};
