const mongoose = require('mongoose')

const weatherDataSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
      trim: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    forecast: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

const WeatherData = mongoose.model('WeatherData', weatherDataSchema)

module.exports = WeatherData
