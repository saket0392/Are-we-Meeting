require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const authrouter = require('./routes/auth');
const availabilityrouter = require('./routes/availability');
const meeting = require('./routes/meetings');
const votesrouter = require('./routes/votes');
const calendarrouter = require('./routes/calendar');
require('./services/reminderCron');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

app.use(express.json());
app.use('/api/auth', authrouter);
app.use('/api/availability', availabilityrouter);
app.use('/api/meetings', meeting);
app.use('/api/votes', votesrouter);
app.use('/api/calendar', calendarrouter);

app.get('/', (req, res) => res.send("Hello world"));

pool.query('SELECT NOW()')
  .then(() => console.log('DB connected'))
  .catch((err) => console.log('DB error', err));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running perfectly on port ${PORT}`);
});