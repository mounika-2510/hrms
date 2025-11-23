const { Log, User } = require('../models');
const { Op } = require('sequelize');

const listLogs = async (req, res, next) => {
  try {
    const { action, startDate, endDate, limit = 50 } = req.query;

    const where = {
      organisation_id: req.user.orgId
    };

    if (action) {
      where.action = action;
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.timestamp[Op.lte] = new Date(endDate);
      }
    }

    const logs = await Log.findAll({
      where,
      include: [{
        model: User,
        attributes: ['id', 'name', 'email']
      }],
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(logs);
  } catch (error) {
    next(error);
  }
};

module.exports = { listLogs };