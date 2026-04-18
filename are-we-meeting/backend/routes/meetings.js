const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { createMeeting, getMeetings, getMyMeetings, confirmMeeting } = require('../controllers/meetingController');

router.post('/',authMiddleware,createMeeting);
router.get('/',authMiddleware,getMyMeetings);
router.get('/:id',authMiddleware,getMeetings);
router.post('/:id/confirm',authMiddleware,confirmMeeting);


module.exports = router;