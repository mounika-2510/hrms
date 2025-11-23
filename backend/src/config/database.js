const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', '..', 'hrms.db'),
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  }
});

module.exports = sequelize;