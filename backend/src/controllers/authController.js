const { registerUser, loginUser } = require('../services/authService')
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      const error = new Error('name, email, and password are required')
      error.statusCode = 400
      throw error
    }
    const data = await registerUser({ name, email, password })
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      ...data,
    })
  } catch (error) {
    return next(error)
  }
}
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      const error = new Error('email and password are required')
      error.statusCode = 400
      throw error
    }

    const data = await loginUser({ email, password })
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      ...data,
    })
  } catch (error) {
    return next(error)
  }
}

const getProfile = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  })
}

module.exports = {
  register,
  login,
  getProfile,
}
