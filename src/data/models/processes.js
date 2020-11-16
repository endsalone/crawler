'use strict';
const uuid = require('uuid');


module.exports = (sequelize, DataTypes) => {
  const processes = sequelize.define('processes', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    keyWord: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  processes.associate = function() {
    // associations can be defined here
  };
  processes.beforeCreate(process => process.id = uuid.v4());
  return processes;
};
