const express = require('express')
const {
  createCrop,
  getCrops,
  getCrop,
  updateCrop,
  updateGrowthStage,
  deleteCrop,
} = require('../controllers/cropController')
const { verifyToken, protectRoutes } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(verifyToken, protectRoutes)

router.post('/', createCrop)
router.get('/', getCrops)
router.get('/:cropId', getCrop)
router.put('/:cropId', updateCrop)
router.patch('/:cropId/growth-stage', updateGrowthStage)
router.delete('/:cropId', deleteCrop)

module.exports = router
