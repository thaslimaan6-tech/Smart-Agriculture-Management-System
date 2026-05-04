const mongoose = require('mongoose')
const Activity = require('../models/activityModel')
const Crop = require('../models/cropModel')

const ensureValidObjectId = (id, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(`Invalid ${fieldName}`)
    error.statusCode = 400
    throw error
  }
}

const ensureCropOwnership = async (cropId, userId) => {
  ensureValidObjectId(cropId, 'cropId')
  const crop = await Crop.findOne({ _id: cropId, userId })
  if (!crop) {
    const error = new Error('Crop not found')
    error.statusCode = 404
    throw error
  }
  return crop
}

const addActivityToCrop = async (payload, userId) => {
  await ensureCropOwnership(payload.cropId, userId)
  return Activity.create(payload)
}

const getActivitiesByCrop = async (cropId, userId) => {
  await ensureCropOwnership(cropId, userId)
  return Activity.find({ cropId }).sort({ date: -1 })
}

const getAllActivitiesForUser = async (userId) => {
  const userCropIds = await Crop.find({ userId }).distinct('_id')
  return Activity.find({ cropId: { $in: userCropIds } })
    .populate('cropId', 'cropType growthStage')
    .sort({ date: -1 })
}

const deleteActivityById = async (activityId, userId) => {
  ensureValidObjectId(activityId, 'activityId')
  const activity = await Activity.findById(activityId)
  if (!activity) {
    const error = new Error('Activity not found')
    error.statusCode = 404
    throw error
  }

  await ensureCropOwnership(activity.cropId, userId)
  await activity.deleteOne()
}

module.exports = {
  addActivityToCrop,
  getActivitiesByCrop,
  getAllActivitiesForUser,
  deleteActivityById,
}
