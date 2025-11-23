const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Log = sequelize.define('Log', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  organisation_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'organisations',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  meta: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('meta');
      return value ? JSON.parse(value) : null;
    },
    set(value) {
      this.setDataValue('meta', JSON.stringify(value));
    }
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'logs',
  timestamps: false
});

module.exports = Log;