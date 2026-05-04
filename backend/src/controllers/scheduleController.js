const {
  addActivitySchedule,
  markScheduleCompleted,
  getUpcomingTasks,
  getOverdueTasks,
  getNotificationReadyTasks,
} = require('../services/scheduleService')

const createSchedule = async (req, res, next) => {
  try {
    const { cropId, activityType, date } = req.body
    if (!cropId || !activityType || !date) {
      const error = new Error('cropId, activityType, and date are required')
      error.statusCode = 400
      throw error
    }

    const schedule = await addActivitySchedule({
      userId: req.user._id,
      cropId,
      activityType,
      date,
    })

    return res.status(201).json({
      success: true,
      message: 'Activity schedule created successfully',
      schedule,
    })
  } catch (error) {
    return next(error)
  }
}

const completeSchedule = async (req, res, next) => {
  try {
    const schedule = await markScheduleCompleted(req.params.scheduleId, req.user._id)
    return res.status(200).json({
      success: true,
      message: 'Schedule marked as completed',
      schedule,
    })
  } catch (error) {
    return next(error)
  }
}

const listUpcomingTasks = async (req, res, next) => {
  try {
    const tasks = await getUpcomingTasks(req.user._id)
    return res.status(200).json({
      success: true,
      tasks,
    })
  } catch (error) {
    return next(error)
  }
}

const listOverdueTasks = async (req, res, next) => {
  try {
    const tasks = await getOverdueTasks(req.user._id)
    return res.status(200).json({
      success: true,
      tasks,
    })
  } catch (error) {
    return next(error)
  }
}

const listNotificationReadyTasks = async (req, res, next) => {
  try {
    const tasks = await getNotificationReadyTasks(req.user._id)
    return res.status(200).json({
      success: true,
      tasks,
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  createSchedule,
  completeSchedule,
  listUpcomingTasks,
  listOverdueTasks,
  listNotificationReadyTasks,
}
