const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getSlots,addSlots,deleteSlots } = require('../controllers/availabilityController');

router.get('/',authMiddleware,getSlots);
router.post('/',authMiddleware,addSlots);
router.delete('/:id',authMiddleware,deleteSlots);

module.exports = router;

