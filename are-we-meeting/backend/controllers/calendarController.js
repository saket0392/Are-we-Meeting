const { google } = require('googleapis')
const pool = require('../db')

function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
}

async function getAuthUrl(req, res) {
  try {
    const oauth2Client = getOAuthClient()
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar.events'],
      state: req.user.id
    })
    res.json({ url })
  } catch (error) {
    return res.status(500).json("error")
  }
}

async function handlecallback(req,res) {

    try {
        const oauth2Client = getOAuthClient()
        const {code,state} = req.query;
        const { tokens } = await oauth2Client.getToken(code)

        await pool.query("UPDATE users SET google_token = $1 WHERE id = $2",[JSON.stringify(tokens),state]);
        res.json({ message: 'Google Calendar connected!' })
    } catch (error) {
        console.error(error.message)
        return res.status(401).json({ error: error.message })
    }
    
}

async function addEvent(req,res) {

    try {
        const {meeting_id} = req.body;
        const result = await pool.query("SELECT google_token FROM users WHERE id = $1",[req.user.id])
        if (!result.rows[0].google_token) {
            return res.status(400).json({ error: 'Google Calendar not connected' })
        }
        const meeting = await pool.query("SELECT title , winner_slot_id FROM meetings WHERE id = $1 ",[meeting_id])
        const slot = await pool.query(" SELECT start_utc , end_utc FROM proposed_slots WHERE id = $1",[meeting.rows[0].winner_slot_id])
        const oauth2Client = getOAuthClient()
        oauth2Client.setCredentials(JSON.parse(result.rows[0].google_token))

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

        await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
            summary: meeting.rows[0].title,
            start: { dateTime: slot.rows[0].start_utc },
            end: { dateTime: slot.rows[0].end_utc },
        }
        })
        return res.status(200).json({ message: 'Event added to calendar!' })
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ error: error.message })
    }
}

module.exports={getAuthUrl,handlecallback,addEvent}