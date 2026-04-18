const pool = require('../db');

async function getSlots(req,res){
    
    try {
        const {id} = req.user;
        const result = await pool.query("SELECT * FROM availability_slots WHERE user_id = $1",[id]);

        return res.json(result.rows);

    } catch (error) {
        return res.status(400).json('Somwthing went wrong');
    }
};

async function addSlots(req,res) {
    try {
        const {day_of_week , start_time , end_time} = req.body;
        const user_id = req.user.id;
        await pool.query("INSERT INTO availability_slots (user_id,day_of_week,start_time,end_time) VALUES($1,$2,$3,$4)",
            [user_id,day_of_week,start_time,end_time]
        )
        res.status(201).json("Insert successfull")
    } catch (error) {
        return res.status(400).json('Something went wrong');
    }
}

async function deleteSlots(req,res) {
    try {
        const slot_id = req.params.id;
        const user_id = req.user.id;
        await pool.query("DELETE FROM availability_slots WHERE id = $1 AND user_id = $2",[slot_id,user_id]);
        res.status(201).json("Deleted successfull")
    } catch (error) {
        return res.status(400).json('Something went wrong');
    }
}

module.exports = {getSlots,addSlots,deleteSlots};