const express = require('express')
const {
  createResource,
  listResources,
  updateResource,
  deleteResource,
} = require('../controllers/resourceController')
const { verifyToken, protectRoutes } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(verifyToken, protectRoutes)

router.post('/', createResource)
router.get('/', listResources)
router.put('/:resourceId', updateResource)
router.delete('/:resourceId', deleteResource)

module.exports = router
