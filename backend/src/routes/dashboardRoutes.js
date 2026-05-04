const express = require('express')
const { getDashboardSummary } = require('../controllers/dashboardController')
const { verifyToken, protectRoutes } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(verifyToken, protectRoutes)

router.get('/', getDashboardSummary)

module.exports = router
