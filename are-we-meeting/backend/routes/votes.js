const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getVotes, removevotes, castvote,  } = require('../controllers/voteController');

router.post('/',authMiddleware,castvote);
router.delete('/',authMiddleware,removevotes);
router.get('/meeting/:meetingId',authMiddleware,getVotes);


module.exports = router;