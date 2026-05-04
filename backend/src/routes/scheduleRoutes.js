const express = require('express')
const {
  createSchedule,
  completeSchedule,
  listUpcomingTasks,
  listOverdueTasks,
  listNotificationReadyTasks,
} = require('../controllers/scheduleController')
const { verifyToken, protectRoutes } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(verifyToken, protectRoutes)

router.post('/', createSchedule)
router.patch('/:scheduleId/complete', completeSchedule)
router.get('/upcoming', listUpcomingTasks)
router.get('/overdue', listOverdueTasks)
router.get('/notifications/pending', listNotificationReadyTasks)

module.exports = router
