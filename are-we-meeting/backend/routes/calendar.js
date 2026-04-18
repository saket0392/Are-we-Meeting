const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getAuthUrl, addEvent, handlecallback } = require('../controllers/calendarController');


router.get('/auth-url',authMiddleware,getAuthUrl);
router.post('/add-event',authMiddleware,addEvent);
router.get('/callback',handlecallback);

module.exports = router;

