'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('Roles', [
      { nom: 'student', createdAt: new Date(), updatedAt: new Date() },
       { nom: 'teacher', createdAt: new Date(), updatedAt: new Date() },
      { nom: 'staff', createdAt: new Date(), updatedAt: new Date() },
     ]);
     await queryInterface.bulkInsert('Users', [
      { nom: 'admin', prenom: 'staff', naissance: new Date() , telephone:'09999999',email:'admin@univ.com',mot_de_passe:'123456',selectedRole:'staff', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('Roles', null, {});
  }
};
