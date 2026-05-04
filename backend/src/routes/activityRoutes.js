const express = require('express')
const {
  createActivity,
  listActivitiesByCrop,
  listAllUserActivities,
  removeActivity,
} = require('../controllers/activityController')
const { verifyToken, protectRoutes } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(verifyToken, protectRoutes)

router.post('/', createActivity)
router.get('/', listAllUserActivities)
router.get('/crop/:cropId', listActivitiesByCrop)
router.delete('/:activityId', removeActivity)

module.exports = router
