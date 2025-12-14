const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const { StatusCodes } = require('http-status-codes');


const subscribeToPlan = async (req, res, next) => {
  try {
    const { planId } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Plan not found' });
    }

    if (plan.trainer.toString() === req.user.userId) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'You cannot subscribe to your own plan' });
    }

    const existingSubscription = await Subscription.findOne({
      user: req.user.userId,
      plan: planId,
    });

    if (existingSubscription) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'You are already subscribed to this plan' });
    }

    const subscription = await Subscription.create({
      user: req.user.userId,
      plan: planId,
    });

    res.status(StatusCodes.CREATED).json({ subscription, message: 'Subscription successful!' });
  } catch (error) {
    next(error);
  }
};

const getMySubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.userId })
      .populate({
        path: 'plan', 
        select: 'title price duration description trainer',
        populate: {
          path: 'trainer', 
          select: 'name email'
        }
      });

      console.log(subscriptions);
    res.status(StatusCodes.OK).json({ count: subscriptions.length, subscriptions });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  subscribeToPlan,
  getMySubscriptions,
};