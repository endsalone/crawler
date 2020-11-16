/* eslint-disable sort-keys */
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('crawlers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      nome: {
        type: Sequelize.STRING
      },
      downloads: {
        type: Sequelize.INTEGER
      },
      idioma: {
        type: Sequelize.STRING(120)
      },
      link: {
        type: Sequelize.STRING
      },
      nota: {
        type: Sequelize.INTEGER
      },
      usuario: {
        type: Sequelize.STRING(120)
      },
      data: {
        type: Sequelize.DATE
      },
      ratio: {
        type: Sequelize.DECIMAL(10,2)
      },
      processId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {         // User belongsTo Company 1:1
          model: 'processes',
          key: 'id'
        }
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
    return queryInterface.dropTable('crawlers');
  }
};
