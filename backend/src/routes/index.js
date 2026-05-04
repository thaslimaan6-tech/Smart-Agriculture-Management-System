const express = require('express')
const healthRoutes = require('./healthRoutes')
const authRoutes = require('./authRoutes')
const cropRoutes = require('./cropRoutes')
const activityRoutes = require('./activityRoutes')
const resourceRoutes = require('./resourceRoutes')
const scheduleRoutes = require('./scheduleRoutes')
const weatherRoutes = require('./weatherRoutes')
const dashboardRoutes = require('./dashboardRoutes')

const router = express.Router()

router.use('/', healthRoutes)
router.use('/auth', authRoutes)
router.use('/crops', cropRoutes)
router.use('/activities', activityRoutes)
router.use('/resources', resourceRoutes)
router.use('/schedules', scheduleRoutes)
router.use('/weather', weatherRoutes)
router.use('/dashboard', dashboardRoutes)

module.exports = router
