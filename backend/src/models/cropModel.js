const mongoose = require('mongoose')

const cropSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cropType: {
      type: String,
      required: true,
      trim: true,
    },
    plantingDate: {
      type: Date,
      required: true,
    },
    harvestDate: {
      type: Date,
    },
    growthStage: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

const Crop = mongoose.model('Crop', cropSchema)

module.exports = Crop
