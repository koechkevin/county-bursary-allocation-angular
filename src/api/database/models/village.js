'use strict';
module.exports = (sequelize, DataTypes) => {
  const Village = sequelize.define('Village', {
    name: DataTypes.STRING,
    sub_location: DataTypes.INTEGER
  }, {});
  Village.associate = function(models) {
    Village.belongsTo(models.SubLocation, {
      foreignKey: 'sub_location',
      onDelete: 'CASCADE',
      as: 'sub_location_data',
    });
    Village.hasMany(models.Application, {
      foreignKey: 'village',
      as: 'applicant_village',
    })
  };
  return Village;
};
