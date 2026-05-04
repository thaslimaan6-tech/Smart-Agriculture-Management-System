const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      required: true,
    },
    activityType: {
      type: String,
      enum: ['irrigation', 'fertilizer'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    notificationStatus: {
      type: String,
      enum: ['pending', 'sent'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
)

const Schedule = mongoose.model('Schedule', scheduleSchema)

module.exports = Schedule
