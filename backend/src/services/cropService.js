const mongoose = require('mongoose')
const Crop = require('../models/cropModel')

const ensureValidCropId = (cropId) => {
  if (!mongoose.Types.ObjectId.isValid(cropId)) {
    const error = new Error('Invalid crop id')
    error.statusCode = 400
    throw error
  }
}

const addCrop = async (payload) => {
  const crop = await Crop.create(payload)
  return crop
}

const getAllCropsByUserId = async (userId) => {
  return Crop.find({ userId }).sort({ createdAt: -1 })
}

const getCropById = async (cropId, userId) => {
  ensureValidCropId(cropId)
  const crop = await Crop.findOne({ _id: cropId, userId })
  if (!crop) {
    const error = new Error('Crop not found')
    error.statusCode = 404
    throw error
  }
  return crop
}

const updateCropById = async (cropId, userId, payload) => {
  ensureValidCropId(cropId)
  const crop = await Crop.findOneAndUpdate({ _id: cropId, userId }, payload, {
    new: true,
    runValidators: true,
  })

  if (!crop) {
    const error = new Error('Crop not found')
    error.statusCode = 404
    throw error
  }

  return crop
}

const updateCropGrowthStage = async (cropId, userId, growthStage) => {
  return updateCropById(cropId, userId, { growthStage })
}

const deleteCropById = async (cropId, userId) => {
  ensureValidCropId(cropId)
  const crop = await Crop.findOneAndDelete({ _id: cropId, userId })
  if (!crop) {
    const error = new Error('Crop not found')
    error.statusCode = 404
    throw error
  }
}

module.exports = {
  addCrop,
  getAllCropsByUserId,
  getCropById,
  updateCropById,
  updateCropGrowthStage,
  deleteCropById,
}
