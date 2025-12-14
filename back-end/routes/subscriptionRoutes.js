const express = require('express');
const router = express.Router();
const { subscribeToPlan, getMySubscriptions } = require('../controllers/subscriptionController');
const { authUser } = require('../middleware/authentication');

router.post('/', authUser, subscribeToPlan);
router.get('/my-subscriptions', authUser, getMySubscriptions);

module.exports = router;