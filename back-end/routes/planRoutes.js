const express = require('express');
const router = express.Router();
const {
  createPlan,
  getAllPlans,
  getMyPlans,
  updatePlan,
  deletePlan,
  getSinglePlan,
  getUserFeed
} = require('../controllers/planController');

const { authUser, authorizePermissions } = require('../middleware/authentication');


router.get('/', getAllPlans);

router.get('/my-plans', authUser, authorizePermissions('trainer'), getMyPlans);

router.post('/', authUser, authorizePermissions('trainer'), createPlan);

router.route('/:id')
  .patch(authUser, authorizePermissions('trainer'), updatePlan)
  .delete(authUser, authorizePermissions('trainer'), deletePlan);

router.get('/feed', authUser, getUserFeed);
  
router.get('/:id',getSinglePlan);

module.exports = router;