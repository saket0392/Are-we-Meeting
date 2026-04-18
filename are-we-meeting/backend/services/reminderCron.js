const cron = require('node-cron')
const pool = require('../db')
const { sendmail } = require('./emailService')

  cron.schedule('* * * * *', async () => {
    try {
        const result = await pool.query(`
    SELECT r.id, u.email, m.title, ps.start_utc
    FROM reminders r
    JOIN users u ON u.id = r.user_id
    JOIN meetings m ON m.id = r.meeting_id
    JOIN proposed_slots ps ON ps.id = m.winner_slot_id
    WHERE r.sent = false AND r.remind_at <= NOW()
  `)

  for (const reminder of result.rows) {
    await sendmail(reminder.email,reminder.title,reminder.start_utc)
    await pool.query("UPDATE reminders SET sent = true, sent_at = NOW() WHERE id = $1" , [reminder.id])
    }
    } catch (error) {
        console.log("error",error);
    }
});

