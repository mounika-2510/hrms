const { Team, Employee, EmployeeTeam, Log } = require('../models');

const listTeams = async (req, res, next) => {
  try {
    const teams = await Team.findAll({
      where: { organisation_id: req.user.orgId },
      include: [{
        model: Employee,
        through: { attributes: [] },
        attributes: ['id', 'first_name', 'last_name', 'email']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json(teams);
  } catch (error) {
    next(error);
  }
};

const getTeam = async (req, res, next) => {
  try {
    const team = await Team.findOne({
      where: {
        id: req.params.id,
        organisation_id: req.user.orgId
      },
      include: [{
        model: Employee,
        through: { attributes: ['assigned_at'] },
        attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
      }]
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(team);
  } catch (error) {
    next(error);
  }
};

const createTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Team name is required' });
    }

    const team = await Team.create({
      organisation_id: req.user.orgId,
      name,
      description
    });

    // Create log
    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: 'team_created',
      meta: { teamId: team.id, name }
    });

    res.status(201).json(team);
  } catch (error) {
    next(error);
  }
};

const updateTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const team = await Team.findOne({
      where: {
        id: req.params.id,
        organisation_id: req.user.orgId
      }
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    await team.update({
      name: name || team.name,
      description: description !== undefined ? description : team.description
    });

    // Create log
    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: 'team_updated',
      meta: { teamId: team.id, changes: req.body }
    });

    res.json(team);
  } catch (error) {
    next(error);
  }
};

const deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findOne({
      where: {
        id: req.params.id,
        organisation_id: req.user.orgId
      }
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const teamName = team.name;
    await team.destroy();

    // Create log
    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: 'team_deleted',
      meta: { teamId: req.params.id, teamName }
    });

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const assignEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.body;
    const teamId = req.params.id;

    if (!employeeId) {
      return res.status(400).json({ message: 'Employee ID is required' });
    }

    // Verify team belongs to org
    const team = await Team.findOne({
      where: {
        id: teamId,
        organisation_id: req.user.orgId
      }
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Verify employee belongs to org
    const employee = await Employee.findOne({
      where: {
        id: employeeId,
        organisation_id: req.user.orgId
      }
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if assignment already exists
    const existingAssignment = await EmployeeTeam.findOne({
      where: { employee_id: employeeId, team_id: teamId }
    });

    if (existingAssignment) {
      return res.status(409).json({ message: 'Employee already assigned to this team' });
    }

    // Create assignment
    await EmployeeTeam.create({
      employee_id: employeeId,
      team_id: teamId
    });

    // Create log
    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: 'employee_assigned_to_team',
      meta: {
        employeeId,
        employeeName: `${employee.first_name} ${employee.last_name}`,
        teamId,
        teamName: team.name
      }
    });

    res.status(201).json({ message: 'Employee assigned to team successfully' });
  } catch (error) {
    next(error);
  }
};

const unassignEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.body;
    const teamId = req.params.id;

    if (!employeeId) {
      return res.status(400).json({ message: 'Employee ID is required' });
    }

    // Verify team belongs to org
    const team = await Team.findOne({
      where: {
        id: teamId,
        organisation_id: req.user.orgId
      }
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Get employee info for logging
    const employee = await Employee.findOne({
      where: {
        id: employeeId,
        organisation_id: req.user.orgId
      }
    });

    // Delete assignment
    const deleted = await EmployeeTeam.destroy({
      where: {
        employee_id: employeeId,
        team_id: teamId
      }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Create log
    if (employee) {
      await Log.create({
        organisation_id: req.user.orgId,
        user_id: req.user.userId,
        action: 'employee_unassigned_from_team',
        meta: {
          employeeId,
          employeeName: `${employee.first_name} ${employee.last_name}`,
          teamId,
          teamName: team.name
        }
      });
    }

    res.json({ message: 'Employee unassigned from team successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployee,
  unassignEmployee
};