/* eslint-disable sort-keys */
'use strict';
const uuid = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const crawlers = sequelize.define('crawlers', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    nome: DataTypes.STRING,
    downloads: DataTypes.INTEGER,
    idioma: DataTypes.STRING,
    link: DataTypes.STRING,
    nota: DataTypes.INTEGER,
    usuario: DataTypes.STRING,
    data: DataTypes.DATE,
    ratio: DataTypes.FLOAT,
    processId: DataTypes.UUID,
  }, {});
  crawlers.associate = function(models) {
    crawlers.belongsTo(models.processes, {foreignKey: 'processId', as: 'process'});
  };
  crawlers.beforeCreate(crawler => crawler.id = uuid.v4());
  return crawlers;
};
