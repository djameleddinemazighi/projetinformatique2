'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('Roles', [
      { nom: 'student', createdAt: new Date(), updatedAt: new Date() },
      { nom: 'teacher', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('Roles', null, {});
  }
};
