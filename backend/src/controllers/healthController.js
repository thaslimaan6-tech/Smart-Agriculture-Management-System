const { buildHealthResponse } = require('../services/healthService')

const getHealth = (req, res) => {
  res.status(200).json(buildHealthResponse())
}

module.exports = {
  getHealth,
}
