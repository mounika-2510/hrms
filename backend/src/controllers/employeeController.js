const { Employee, Team, Log } = require('../models');

const listEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.findAll({
      where: { organisation_id: req.user.orgId },
      include: [{
        model: Team,
        through: { attributes: [] },
        attributes: ['id', 'name']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json(employees);
  } catch (error) {
    next(error);
  }
};

const getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({
      where: {
        id: req.params.id,
        organisation_id: req.user.orgId
      },
      include: [{
        model: Team,
        through: { attributes: ['assigned_at'] },
        attributes: ['id', 'name', 'description']
      }]
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    next(error);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone } = req.body;

    // Validation
    if (!first_name || !last_name || !email) {
      return res.status(400).json({ message: 'First name, last name, and email are required' });
    }

    const employee = await Employee.create({
      organisation_id: req.user.orgId,
      first_name,
      last_name,
      email,
      phone
    });

    // Create log
    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: 'employee_created',
      meta: { employeeId: employee.id, first_name, last_name, email }
    });

    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone } = req.body;

    const employee = await Employee.findOne({
      where: {
        id: req.params.id,
        organisation_id: req.user.orgId
      }
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.update({
      first_name: first_name || employee.first_name,
      last_name: last_name || employee.last_name,
      email: email || employee.email,
      phone: phone !== undefined ? phone : employee.phone
    });

    // Create log
    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: 'employee_updated',
      meta: { employeeId: employee.id, changes: req.body }
    });

    res.json(employee);
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({
      where: {
        id: req.params.id,
        organisation_id: req.user.orgId
      }
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const employeeName = `${employee.first_name} ${employee.last_name}`;
    await employee.destroy();

    // Create log
    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: 'employee_deleted',
      meta: { employeeId: req.params.id, employeeName }
    });

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
};