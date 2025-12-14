const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FitnessPlan',
    required: true
  },
  purchasedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

subscriptionSchema.index({ user: 1, plan: 1 }, { unique: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);