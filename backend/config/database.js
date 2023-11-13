const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('projet', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql', // Choose the appropriate dialect
});

module.exports = sequelize;