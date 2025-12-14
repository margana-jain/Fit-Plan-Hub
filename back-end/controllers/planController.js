const Plan = require('../models/Plan');
const { StatusCodes } = require('http-status-codes');
const Subscription = require('../models/Subscription');
const jwt = require('jsonwebtoken');
const Follow = require('../models/Follow'); 

const createPlan = async (req, res, next) => {
  try {
    req.body.trainer = req.user.userId;
    if (!req.body.title || !req.body.price) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Title and Price are required' });
    }
    const plan = await Plan.create(req.body);

    res.status(StatusCodes.CREATED).json({ plan });
  } catch (error) {
    next(error);
  }
};


const getAllPlans = async (req, res, next) => {
  try { 
    const plans = await Plan.find().populate('trainer', 'name email');
    res.status(StatusCodes.OK).json({ count: plans.length, plans });
  } catch (error) {
    next(error);
  }
};

const getMyPlans = async (req, res, next) => {
  try {
    const plans = await Plan.find({ trainer: req.user.userId });
    res.status(StatusCodes.OK).json({ plans });
  } catch (error) {
    next(error);
  }
};

const updatePlan = async (req, res, next) => {
  try {
    const { id: planId } = req.params;

    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Plan not found' });
    }

    if (plan.trainer.toString() !== req.user.userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized to edit this plan' });
    }

    const updatedPlan = await Plan.findByIdAndUpdate(planId, req.body, {
      new: true, 
    //   runValidators: true, 
    });

    res.status(StatusCodes.OK).json({ plan: updatedPlan });
  } catch (error) {
    next(error);
  }
};

const deletePlan = async (req, res, next) => {
  try {
    const { id: planId } = req.params;

    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Plan not found' });
    }

    if (plan.trainer.toString() !== req.user.userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized to delete this plan' });
    }

    await plan.deleteOne();

    res.status(StatusCodes.OK).json({ message: 'Plan removed' });
  } catch (error) {
    next(error);
  }
};

const getSinglePlan = async (req, res, next) => {
  try {
    const { id: planId } = req.params;

    const plan = await Plan.findById(planId).populate('trainer', 'name');

    if (!plan) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Plan not found' });
    }

    let planData = {
      _id: plan._id,
      title: plan.title,
      price: plan.price,
      trainer: plan.trainer,
      duration: plan.duration,
      access: 'preview' 
    };

    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            const userId = payload.userId;
            
            const isOwner = plan.trainer._id.toString() === userId;
            
            const subscription = await Subscription.findOne({ user: userId, plan: planId });
            
            if (isOwner || subscription) {
                planData.description = plan.description;
                planData.access = 'full';
            }
        } catch (error) {
            console.log("Token verification failed in getSinglePlan, returning preview.");
        }
    }

    res.status(StatusCodes.OK).json({ plan: planData });
  } catch (error) {
    next(error);
  }
};


const getUserFeed = async (req, res, next) => {
  try {
    const followingDocs = await Follow.find({ follower: req.user.userId }).select('following');

    const trainerIds = followingDocs.map(doc => doc.following);

    const feedPlans = await Plan.find({
      trainer: { $in: trainerIds }
    })
    .populate('trainer', 'name email') // Show who created it
    .sort({ createdAt: -1 }); // Newest first

    res.status(StatusCodes.OK).json({ count: feedPlans.length, plans: feedPlans });
  } catch (error) {
    next(error);
  }
};



module.exports = {
    createPlan,
    getAllPlans,
    getSinglePlan,
    getMyPlans,
    updatePlan,
    deletePlan,
    getUserFeed, 
};