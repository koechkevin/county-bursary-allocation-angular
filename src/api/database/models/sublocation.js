'use strict';
module.exports = (sequelize, DataTypes) => {
  const SubLocation = sequelize.define('SubLocation', {
    name: DataTypes.STRING,
    location: DataTypes.INTEGER
  }, {});
  SubLocation.associate = function(models) {
    SubLocation.belongsTo(models.Location, {
      foreignKey: 'location',
      onDelete: 'CASCADE',
      as: 'location_data',
    });
    SubLocation.hasMany(models.Village, {
      foreignKey: 'sub_location',
      as: 'sub_location_data',
    })
  };
  return SubLocation;
};
