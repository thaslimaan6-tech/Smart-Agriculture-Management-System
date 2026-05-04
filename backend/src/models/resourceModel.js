const mongoose = require('mongoose')

const resourceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['water', 'fertilizer', 'pesticide'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

const Resource = mongoose.model('Resource', resourceSchema)

module.exports = Resource
