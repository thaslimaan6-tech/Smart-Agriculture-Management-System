const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const signToken = (user) => {
  if (!process.env.JWT_SECRET) {
    const error = new Error('JWT_SECRET is not configured')
    error.statusCode = 500
    throw error
  }

  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() })
  if (existingUser) {
    const error = new Error('User already exists with this email')
    error.statusCode = 409
    throw error
  }

  const user = await User.create({ name, email, password })
  const token = signToken(user)

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  }
}

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) {
    const error = new Error('Invalid email or password')
    error.statusCode = 401
    throw error
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password')
    error.statusCode = 401
    throw error
  }

  const token = signToken(user)

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  }
}

module.exports = {
  registerUser,
  loginUser,
}
