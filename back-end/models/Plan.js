const mongoose = require('mongoose');

const fitnessPlanSchema = new mongoose.Schema({
    title : {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    duration: {
        type: Number,
        required: [true, 'Duration in weeks is required'],
        min: [1, 'Duration must be at least 1 week'],
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('FitnessPlan', fitnessPlanSchema);