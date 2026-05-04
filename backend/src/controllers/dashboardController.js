const { getDashboardSummary: getDashboardSummaryData } = require('../services/dashboardService')

const getDashboardSummary = async (req, res, next) => {
  try {
    const dashboard = await getDashboardSummaryData(req.user._id)
    return res.status(200).json({
      success: true,
      ...dashboard,
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getDashboardSummary,
}
