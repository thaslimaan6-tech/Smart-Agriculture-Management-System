const {
  addCrop,
  getAllCropsByUserId,
  getCropById,
  updateCropById,
  updateCropGrowthStage,
  deleteCropById,
} = require('../services/cropService')

const createCrop = async (req, res, next) => {
  try {
    const { cropType, plantingDate, harvestDate, growthStage } = req.body
    if (!cropType || !plantingDate || !growthStage) {
      const error = new Error('cropType, plantingDate, and growthStage are required')
      error.statusCode = 400
      throw error
    }

    const crop = await addCrop({
      userId: req.user._id,
      cropType,
      plantingDate,
      harvestDate,
      growthStage,
    })

    return res.status(201).json({
      success: true,
      message: 'Crop added successfully',
      crop,
    })
  } catch (error) {
    return next(error)
  }
}

const getCrops = async (req, res, next) => {
  try {
    const crops = await getAllCropsByUserId(req.user._id)
    return res.status(200).json({ success: true, crops })
  } catch (error) {
    return next(error)
  }
}

const getCrop = async (req, res, next) => {
  try {
    const crop = await getCropById(req.params.cropId, req.user._id)
    return res.status(200).json({ success: true, crop })
  } catch (error) {
    return next(error)
  }
}

const updateCrop = async (req, res, next) => {
  try {
    const crop = await updateCropById(req.params.cropId, req.user._id, req.body)
    return res.status(200).json({
      success: true,
      message: 'Crop updated successfully',
      crop,
    })
  } catch (error) {
    return next(error)
  }
}

const updateGrowthStage = async (req, res, next) => {
  try {
    const { growthStage } = req.body
    if (!growthStage) {
      const error = new Error('growthStage is required')
      error.statusCode = 400
      throw error
    }

    const crop = await updateCropGrowthStage(req.params.cropId, req.user._id, growthStage)
    return res.status(200).json({
      success: true,
      message: 'Growth stage updated successfully',
      crop,
    })
  } catch (error) {
    return next(error)
  }
}

const deleteCrop = async (req, res, next) => {
  try {
    await deleteCropById(req.params.cropId, req.user._id)
    return res.status(200).json({
      success: true,
      message: 'Crop deleted successfully',
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  createCrop,
  getCrops,
  getCrop,
  updateCrop,
  updateGrowthStage,
  deleteCrop,
}
