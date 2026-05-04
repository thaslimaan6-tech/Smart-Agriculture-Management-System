const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema(
  {
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      required: true,
    },
    activityType: {
      type: String,
      enum: ['watering', 'fertilizing', 'pesticide'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

const Activity = mongoose.model('Activity', activitySchema)

module.exports = Activity
