const sequelize = require('../config/database');
const Organisation = require('./organisation');
const User = require('./user');
const Employee = require('./employee');
const Team = require('./team');
const EmployeeTeam = require('./employeeTeam');
const Log = require('./log');

// Define relationships
Organisation.hasMany(User, { foreignKey: 'organisation_id' });
User.belongsTo(Organisation, { foreignKey: 'organisation_id' });

Organisation.hasMany(Employee, { foreignKey: 'organisation_id' });
Employee.belongsTo(Organisation, { foreignKey: 'organisation_id' });

Organisation.hasMany(Team, { foreignKey: 'organisation_id' });
Team.belongsTo(Organisation, { foreignKey: 'organisation_id' });

// Many-to-many relationship between Employee and Team
Employee.belongsToMany(Team, {
  through: EmployeeTeam,
  foreignKey: 'employee_id',
  otherKey: 'team_id'
});

Team.belongsToMany(Employee, {
  through: EmployeeTeam,
  foreignKey: 'team_id',
  otherKey: 'employee_id'
});

Organisation.hasMany(Log, { foreignKey: 'organisation_id' });
Log.belongsTo(Organisation, { foreignKey: 'organisation_id' });

User.hasMany(Log, { foreignKey: 'user_id' });
Log.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  Organisation,
  User,
  Employee,
  Team,
  EmployeeTeam,
  Log
};