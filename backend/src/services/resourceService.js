const mongoose = require('mongoose')
const Resource = require('../models/resourceModel')

const ensureValidResourceId = (resourceId) => {
  if (!mongoose.Types.ObjectId.isValid(resourceId)) {
    const error = new Error('Invalid resource id')
    error.statusCode = 400
    throw error
  }
}

const addResourceUsage = async (payload) => {
  return Resource.create(payload)
}

const getResourcesByUser = async (userId) => {
  return Resource.find({ userId }).sort({ date: -1 })
}

const updateResourceById = async (resourceId, userId, payload) => {
  ensureValidResourceId(resourceId)
  const resource = await Resource.findOneAndUpdate(
    { _id: resourceId, userId },
    payload,
    { new: true, runValidators: true },
  )

  if (!resource) {
    const error = new Error('Resource not found')
    error.statusCode = 404
    throw error
  }

  return resource
}

const deleteResourceById = async (resourceId, userId) => {
  ensureValidResourceId(resourceId)
  const resource = await Resource.findOneAndDelete({ _id: resourceId, userId })
  if (!resource) {
    const error = new Error('Resource not found')
    error.statusCode = 404
    throw error
  }
}

module.exports = {
  addResourceUsage,
  getResourcesByUser,
  updateResourceById,
  deleteResourceById,
}
