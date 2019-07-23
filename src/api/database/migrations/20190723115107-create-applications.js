'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Applications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },sub_county: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Subcounties',
          key: 'id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      },
      sub_location: {
        type: Sequelize.INTEGER,
        references: {
          model: 'SubLocations',
          key: 'id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      },
      location: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Locations',
          key: 'id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      },
      ward: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Wards',
          key: 'id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      },
      village: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Villages',
          key: 'id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      },
      disability: {
        type: Sequelize.STRING
      },
      institution: {
        type: Sequelize.STRING
      },
      guardian: {
        type: Sequelize.STRING
      },
      contact: {
        type: Sequelize.INTEGER
      },
      fee_balance: {
        type: Sequelize.INTEGER
      },
      requested_amount: {
        type: Sequelize.INTEGER
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Applications');
  }
};
