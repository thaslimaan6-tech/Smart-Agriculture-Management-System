const {
  addResourceUsage,
  getResourcesByUser,
  updateResourceById,
  deleteResourceById,
} = require('../services/resourceService')

const createResource = async (req, res, next) => {
  try {
    const { type, quantity, date } = req.body
    if (!type || quantity === undefined) {
      const error = new Error('type and quantity are required')
      error.statusCode = 400
      throw error
    }

    const resource = await addResourceUsage({
      userId: req.user._id,
      type,
      quantity,
      date,
    })

    return res.status(201).json({
      success: true,
      message: 'Resource usage added successfully',
      resource,
    })
  } catch (error) {
    return next(error)
  }
}

const listResources = async (req, res, next) => {
  try {
    const resources = await getResourcesByUser(req.user._id)
    return res.status(200).json({
      success: true,
      resources,
    })
  } catch (error) {
    return next(error)
  }
}

const updateResource = async (req, res, next) => {
  try {
    const resource = await updateResourceById(req.params.resourceId, req.user._id, req.body)
    return res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      resource,
    })
  } catch (error) {
    return next(error)
  }
}

const deleteResource = async (req, res, next) => {
  try {
    await deleteResourceById(req.params.resourceId, req.user._id)
    return res.status(200).json({
      success: true,
      message: 'Resource deleted successfully',
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  createResource,
  listResources,
  updateResource,
  deleteResource,
}
