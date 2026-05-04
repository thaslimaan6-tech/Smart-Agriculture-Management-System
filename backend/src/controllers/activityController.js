const {
  addActivityToCrop,
  getActivitiesByCrop,
  getAllActivitiesForUser,
  deleteActivityById,
} = require('../services/activityService')

const createActivity = async (req, res, next) => {
  try {
    const { cropId, activityType, date, description } = req.body
    if (!cropId || !activityType) {
      const error = new Error('cropId and activityType are required')
      error.statusCode = 400
      throw error
    }

    const activity = await addActivityToCrop(
      { cropId, activityType, date, description },
      req.user._id,
    )

    return res.status(201).json({
      success: true,
      message: 'Activity added successfully',
      activity,
    })
  } catch (error) {
    return next(error)
  }
}

const listActivitiesByCrop = async (req, res, next) => {
  try {
    const activities = await getActivitiesByCrop(req.params.cropId, req.user._id)
    return res.status(200).json({
      success: true,
      activities,
    })
  } catch (error) {
    return next(error)
  }
}

const listAllUserActivities = async (req, res, next) => {
  try {
    const activities = await getAllActivitiesForUser(req.user._id)
    return res.status(200).json({
      success: true,
      activities,
    })
  } catch (error) {
    return next(error)
  }
}

const removeActivity = async (req, res, next) => {
  try {
    await deleteActivityById(req.params.activityId, req.user._id)
    return res.status(200).json({
      success: true,
      message: 'Activity deleted successfully',
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  createActivity,
  listActivitiesByCrop,
  listAllUserActivities,
  removeActivity,
}
