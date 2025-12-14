const express = require('express');
const router = express.Router();
const { followTrainer, unfollowTrainer, getMyFollowing } = require('../controllers/followController');
const { authUser } = require('../middleware/authentication');

router.post('/', authUser, followTrainer);
router.post('/unfollow', authUser, unfollowTrainer);
router.get('/following', authUser, getMyFollowing);

module.exports = router;