'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subcounty = sequelize.define('Subcounty', {
    name: DataTypes.STRING
  }, {});
  Subcounty.associate = function(models) {
    Subcounty.hasMany(models.Ward, {
      foreignKey: 'sub_county',
      as: 'parent',
    });
    Subcounty.hasMany(models.Application, {
      foreignKey: 'sub_county',
      as: 'applicant_sub_county',
    })
  };
  return Subcounty;
};
