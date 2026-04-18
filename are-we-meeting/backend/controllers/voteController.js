const pool = require('../db');

async function castvote(req,res) {
    
    try {
        const {proposed_slot_id,meeting_id} = req.body;
        const id = req.user.id;
        const result = await pool.query("SELECT * FROM meeting_participants WHERE meeting_id = $1 AND user_id = $2",[meeting_id,id])
        if(result.rows.length == 0){
            return res.status(403).json("can't vote");
        }
        await pool.query("INSERT INTO votes (participant_id,proposed_slot_id) VALUES($1,$2)",
            [result.rows[0].id,proposed_slot_id]
        )
        return res.status(200).json("successfully voted");
    } catch (error) {
         return res.status(401).json("UNSUCCESSFUL")
    }
}

async function removevotes(req,res) {
    try {
        const {proposed_slot_id,meeting_id} = req.body;
        const id = req.user.id;
        const result = await pool.query("SELECT * FROM meeting_participants WHERE meeting_id = $1 AND user_id = $2",[meeting_id,id])
        if(result.rows.length == 0){
            return res.status(403).json("can't vote");
        }
        await pool.query("DELETE FROM votes WHERE proposed_slot_id = $1 AND participant_id = $2",[proposed_slot_id,result.rows[0].id])
        return res.status(200).json("successfully deleted");
    } catch (error) {
         return res.status(401).json("UNSUCCESSFUL")
    }
}

async function getVotes(req,res) {
    try {
        const meeting_id = req.params.meetingId;
        const result = await pool.query ("SELECT ps.id, ps.start_utc, ps.end_utc, COUNT(v.id) as vote_count FROM proposed_slots ps LEFT JOIN votes v ON v.proposed_slot_id = ps.id WHERE ps.meeting_id = $1 GROUP BY ps.id",
            [meeting_id]
        )
        return res.json(result.rows);
    } catch (error) {
        return res.status(401).json("failed")
    }
    
}

module.exports = {castvote,removevotes,getVotes};