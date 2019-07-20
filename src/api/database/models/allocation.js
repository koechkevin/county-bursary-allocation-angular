'use strict';
module.exports = (sequelize, DataTypes) => {
  const Allocation = sequelize.define('Allocation', {
    amount: DataTypes.INTEGER
  }, {});
  Allocation.associate = function(models) {
    // associations can be defined here
  };
  return Allocation;
};