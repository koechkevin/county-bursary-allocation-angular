'use strict';
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    name: DataTypes.STRING,
    ward: DataTypes.INTEGER
  }, {});
  Location.associate = function(models) {
    Location.belongsTo(models.Ward, {
      foreignKey: 'ward',
      onDelete: 'CASCADE',
      as: 'ward_data',
    });
    Location.hasMany(models.SubLocation, {
      foreignKey: 'location',
      as: 'location_data',
    });
    Location.hasMany(models.Application, {
      foreignKey: 'location',
      as: 'applicant_location',
    })
  };
  return Location;
};
