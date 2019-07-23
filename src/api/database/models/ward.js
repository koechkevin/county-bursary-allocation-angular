'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ward = sequelize.define('Ward', {
    name: DataTypes.STRING,
    sub_county: DataTypes.INTEGER
  }, {});
  Ward.associate = function(models) {
    Ward.belongsTo(models.Subcounty, {
      foreignKey: 'sub_county',
      onDelete: 'CASCADE',
      as: 'parent',
    });
    Ward.hasMany(models.Location, {
      foreignKey: 'ward',
      as: 'ward_data',
    });
    Ward.hasMany(models.Application, {
      foreignKey: 'ward',
      as: 'applicant_ward',
    })
  };
  return Ward;
};
