'use strict';
module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define('Application', {
    name: DataTypes.STRING,
    sub_location: DataTypes.INTEGER,
    sub_county: DataTypes.INTEGER,
    location: DataTypes.INTEGER,
    ward: DataTypes.INTEGER,
    village: DataTypes.INTEGER,
    disability: DataTypes.STRING,
    institution: DataTypes.STRING,
    guardian: DataTypes.STRING,
    contact: DataTypes.INTEGER,
    fee_balance: DataTypes.INTEGER,
    requested_amount: DataTypes.INTEGER
  }, {});
  Application.associate = function(models) {
    Application.belongsTo(models.Village, {
      foreignKey: 'village',
      onDelete: 'CASCADE',
      as: 'applicant_village',
    });
    Application.belongsTo(models.Subcounty, {
      foreignKey: 'sub_county',
      onDelete: 'CASCADE',
      as: 'applicant_sub_county',
    });
    Application.belongsTo(models.Ward, {
      foreignKey: 'ward',
      onDelete: 'CASCADE',
      as: 'applicant_ward',
    });
    Application.belongsTo(models.Location, {
      foreignKey: 'location',
      onDelete: 'CASCADE',
      as: 'applicant_location',
    });
    Application.belongsTo(models.SubLocation, {
      foreignKey: 'sub_location',
      onDelete: 'CASCADE',
      as: 'applicant_sub_location',
    });
  };
  return Application;
};
