const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('Authorization token missing')
      error.statusCode = 401
      throw error
    }
    if (!process.env.JWT_SECRET) {
      const error = new Error('JWT_SECRET is not configured')
      error.statusCode = 500
      throw error
    }
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.auth = decoded
    return next()
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 401
      error.message = 'Invalid or expired token'
    }
    return next(error)
  }
}
const protectRoutes = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.id).select('-password')
    if (!user) {
      const error = new Error('User not found for this token')
      error.statusCode = 401
      throw error
    }

    req.user = user
    return next()
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  verifyToken,
  protectRoutes,
}
