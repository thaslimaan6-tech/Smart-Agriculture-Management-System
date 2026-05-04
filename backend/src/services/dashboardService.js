const Crop = require('../models/cropModel')
const Activity = require('../models/activityModel')
const Resource = require('../models/resourceModel')
const Schedule = require('../models/scheduleModel')

const getUpcomingIrrigationAlerts = async (userId) => {
  const next48Hours = new Date(Date.now() + 48 * 60 * 60 * 1000)
  return Schedule.find({
    userId,
    completed: false,
    activityType: 'irrigation',
    date: { $gte: new Date(), $lte: next48Hours },
  })
    .populate('cropId', 'cropType growthStage')
    .sort({ date: 1 })
}

const getOverdueActivityAlerts = async (userId) => {
  return Schedule.find({
    userId,
    completed: false,
    date: { $lt: new Date() },
  })
    .populate('cropId', 'cropType growthStage')
    .sort({ date: 1 })
}

const getDashboardAlerts = async (userId) => {
  const [upcomingIrrigation, overdueActivities] = await Promise.all([
    getUpcomingIrrigationAlerts(userId),
    getOverdueActivityAlerts(userId),
  ])

  return {
    upcomingIrrigation,
    overdueActivities,
    totalAlerts: upcomingIrrigation.length + overdueActivities.length,
  }
}

const getResourceUsageSummary = async (userId) => {
  const grouped = await Resource.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: '$type',
        totalQuantity: { $sum: '$quantity' },
        entries: { $sum: 1 },
      },
    },
  ])

  const summaryByType = {
    water: { totalQuantity: 0, entries: 0 },
    fertilizer: { totalQuantity: 0, entries: 0 },
    pesticide: { totalQuantity: 0, entries: 0 },
  }

  grouped.forEach((item) => {
    summaryByType[item._id] = {
      totalQuantity: item.totalQuantity,
      entries: item.entries,
    }
  })

  return summaryByType
}

const getUpcomingSchedules = async (userId) => {
  return Schedule.find({
    userId,
    completed: false,
    date: { $gte: new Date() },
  })
    .populate('cropId', 'cropType growthStage')
    .sort({ date: 1 })
}

const getDashboardSummary = async (userId) => {
  const [cropIds, totalCrops, resourceUsageSummary, upcomingSchedules, alerts] =
    await Promise.all([
      Crop.find({ userId }).distinct('_id'),
      Crop.countDocuments({ userId }),
      getResourceUsageSummary(userId),
      getUpcomingSchedules(userId),
      getDashboardAlerts(userId),
    ])

  const totalActivities = await Activity.countDocuments({ cropId: { $in: cropIds } })

  return {
    totalCrops,
    totalActivities,
    resourceUsageSummary,
    upcomingSchedules,
    alerts,
  }
}

module.exports = {
  getDashboardAlerts,
  getDashboardSummary,
}
