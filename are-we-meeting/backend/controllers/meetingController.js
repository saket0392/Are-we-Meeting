const pool = require('../db');
const { DateTime } = require('luxon')  
const { findOverlappingSlots } = require('../utils/overlapfinder');

async function createMeeting(req,res) {
    
    try {
        const {title , duration_mins , search_from , search_until ,invitee_emails} = req.body;
        const organizer_id = req.user.id;
        const result = await pool.query('INSERT INTO meetings (organizer_id,title , duration_mins , search_from , search_until ) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [organizer_id,title , duration_mins , search_from , search_until]
        )
        const meeting = result.rows[0];
        await pool.query(
            'INSERT INTO meeting_participants (meeting_id, user_id, email) VALUES ($1, $2, $3)',
            [meeting.id, organizer_id, req.user.email]
        )
        for(const email of invitee_emails){
            const userresult = await pool.query("SELECT * FROM users where email = $1",[email])
            const user = userresult.rows[0];

            await pool.query("INSERT INTO meeting_participants (meeting_id,user_id,email) VALUES ($1,$2,$3)",
                [meeting.id,user?user.id:null,email]
            )
        }
        
        const participants = await pool.query ("SELECT u.timezone, json_agg(a) as slots FROM meeting_participants mp JOIN users u ON u.id = mp.user_id JOIN availability_slots a ON a.user_id = mp.user_id WHERE mp.meeting_id = $1 AND mp.user_id IS NOT NULL GROUP BY u.timezone" , [meeting.id])
        console.log('participants:', JSON.stringify(participants.rows))
        let current = DateTime.fromISO(search_from);
        const end = DateTime.fromISO(search_until);

        while(current <= end){
            
            const overlap = findOverlappingSlots(participants.rows,current.toISODate(),duration_mins);
            if (overlap) {
                await pool.query(
                'INSERT INTO proposed_slots (meeting_id, start_utc, end_utc) VALUES ($1, $2, $3)',
                [meeting.id, overlap.start, overlap.end]
                )
            }
            current = current.plus({ days: 1 })
        }
        return res.status(201).json({
            message: "INSERT SUCCESSFULL",
            meeting
        })
    } catch (error) {
       console.error(error.message)  // add this
        return res.status(500).json({ error: error.message })
    }
     
}

async function getMyMeetings(req,res) {
    
     try {
        const id = req.user.id;
        const result = await pool.query("SELECT * FROM meetings WHERE organizer_id = $1",[id])
        return res.status(200).json(result.rows);
     } catch (error) {
        return res.status(401).json("UNSUCCESSFUL")
     }
}

async function getMeetings(req,res) {
    try {
        const id = req.params.id;
        const result = await pool.query("SELECT * FROM meetings WHERE id = $1",[id]);
        if(result.rows.length == 0) {
            return res.status(404).json("something went wrong");
        }
        const resultproposed = await pool.query("SELECT * FROM proposed_slots WHERE meeting_id = $1",[id])
        return res.status(200).json({meeting : result.rows,proposed_slots :resultproposed.rows});
    } catch (error) {
        return res.status(401).json("UNSUCCESSFUL");
    }
}

async function confirmMeeting(req,res) {
    try {
        const {slot_id }= req.body;
        const user_id = req.user.id;
        const meeting_id = req.params.id;
        const result = await pool.query("SELECT * FROM meetings WHERE organizer_id = $1 AND id = $2 ",[user_id,meeting_id]);
        if(result.rows.length == 0) {
            return res.status(404).json("something went wrong");
        }
        await pool.query("UPDATE meetings SET status = 'confirmed', winner_slot_id = $1 WHERE id = $2",[slot_id,meeting_id])
        
        const slot = await pool.query("SELECT * FROM proposed_slots WHERE id = $1",[slot_id]);
        const start_utc = slot.rows[0].start_utc;

        const remind_at = new Date(new Date(start_utc).getTime()-30*60*1000);

        const participants = await pool.query("SELECT * FROM meeting_participants WHERE meeting_id = $1 AND user_id IS NOT NULL",
            [meeting_id]
        )

        for(const participant of participants.rows){
            await pool.query("INSERT INTO reminders (meeting_id,user_id,remind_at) VALUES($1,$2,$3)",[meeting_id,participant.user_id,remind_at]);
        }
        return res.status(200).json("insert successful")
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ error: error.message })
    }
}

module.exports = {createMeeting,getMeetings,getMyMeetings,confirmMeeting};
