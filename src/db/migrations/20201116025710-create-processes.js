/* eslint-disable sort-keys */
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('processes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      keyWord: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('processes');
  }
};
