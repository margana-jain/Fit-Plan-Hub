const Follow = require('../models/Follow');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');

const followTrainer = async (req, res, next) => {
  try {
    const { trainerId } = req.body;

    if (trainerId === req.user.userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'You cannot follow yourself' });
    }
    

    const trainer = await User.findById(trainerId);
    if (!trainer || trainer.role !== 'trainer') {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Trainer not found' });
    }

    const existingFollow = await Follow.findOne({
      follower: req.user.userId,
      following: trainerId,
    });

    if (existingFollow) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'You are already following this trainer' });
    }

    await Follow.create({
      follower: req.user.userId,
      following: trainerId,
    });

    res.status(StatusCodes.CREATED).json({ message: `You are now following ${trainer.name}` });
  } catch (error) {
    next(error);
  }
};

const unfollowTrainer = async (req, res, next) => {
  try {
    const { trainerId } = req.body;

    const deleted = await Follow.findOneAndDelete({
      follower: req.user.userId,
      following: trainerId,
    });

    if (!deleted) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'You were not following this trainer' });
    }

    res.status(StatusCodes.OK).json({ message: 'Unfollowed successfully' });
  } catch (error) {
    next(error);
  }
};

const getMyFollowing = async (req, res, next) => {
  try {
    const following = await Follow.find({ follower: req.user.userId })
      .populate('following', 'name email role');

    res.status(StatusCodes.OK).json({ count: following.length, following });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  followTrainer,
  unfollowTrainer,
  getMyFollowing,
};