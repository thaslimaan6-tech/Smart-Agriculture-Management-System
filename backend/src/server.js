const dotenv = require('dotenv')
const mongoose = require('mongoose')
const app = require('./app')
const connectDB = require('./config/db')

dotenv.config()

const PORT = process.env.PORT || 5000
const skipDb = process.env.SKIP_DB === 'true'

const startServer = async () => {
  if (!skipDb) {
    await connectDB()
  } else {
    // Disable mongoose query buffering so DB-dependent endpoints fail immediately
    // instead of hanging for 10s when SKIP_DB is enabled.
    mongoose.set('bufferCommands', false)
    // eslint-disable-next-line no-console
    console.warn('SKIP_DB=true, starting server without database connection')
  }
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`)
  })
}

startServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', error.message)
  process.exit(1)
})
