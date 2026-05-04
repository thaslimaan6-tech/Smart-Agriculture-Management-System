const mongoose = require('mongoose')
const Crop = require('../models/cropModel')
const Schedule = require('../models/scheduleModel')

const ensureValidId = (id, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(`Invalid ${fieldName}`)
    error.statusCode = 400
    throw error
  }
}

const ensureUserOwnsCrop = async (cropId, userId) => {
  ensureValidId(cropId, 'cropId')
  const crop = await Crop.findOne({ _id: cropId, userId })
  if (!crop) {
    const error = new Error('Crop not found')
    error.statusCode = 404
    throw error
  }
}

const addActivitySchedule = async ({ userId, cropId, activityType, date }) => {
  await ensureUserOwnsCrop(cropId, userId)
  return Schedule.create({ userId, cropId, activityType, date })
}

const markScheduleCompleted = async (scheduleId, userId) => {
  ensureValidId(scheduleId, 'scheduleId')
  const schedule = await Schedule.findOneAndUpdate(
    { _id: scheduleId, userId },
    {
      completed: true,
      completedAt: new Date(),
      notificationStatus: 'sent',
    },
    { new: true, runValidators: true },
  )
  if (!schedule) {
    const error = new Error('Schedule not found')
    error.statusCode = 404
    throw error
  }
  return schedule
}

const getUpcomingTasks = async (userId) => {
  return Schedule.find({
    userId,
    completed: false,
    date: { $gte: new Date() },
  })
    .populate('cropId', 'cropType growthStage')
    .sort({ date: 1 })
}

const getOverdueTasks = async (userId) => {
  return Schedule.find({
    userId,
    completed: false,
    date: { $lt: new Date() },
  })
    .populate('cropId', 'cropType growthStage')
    .sort({ date: 1 })
}

const getNotificationReadyTasks = async (userId) => {
  const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000)
  return Schedule.find({
    userId,
    completed: false,
    notificationStatus: 'pending',
    date: { $gte: new Date(), $lte: in24Hours },
  })
    .populate('cropId', 'cropType')
    .sort({ date: 1 })
}

module.exports = {
  addActivitySchedule,
  markScheduleCompleted,
  getUpcomingTasks,
  getOverdueTasks,
  getNotificationReadyTasks,
}
