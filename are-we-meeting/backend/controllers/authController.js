const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db')


async function register(req,res) {

    try {
        const {name , email , password , timezone} = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1',[email]);
        if (result.rows.length>0) {
            return res.status(409).json({error : 'Email already in use'});
        };

        const saltrounds = 12;
        const hashedpassword = await bcrypt.hash(password,saltrounds);

        const insert = await pool.query(
            'INSERT INTO users (name , email , password , timezone) VALUES ($1,$2,$3,$4)',
            [name , email, hashedpassword, timezone]
        );
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json('Something went wrong');
    }
}

async function login(req,res) {
    try {
        const {email , password} = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        

        if (result.rows.length == 0) {
            return res.status(404).json('User not found');
        }
        const user = result.rows[0]
        const ismatch = await bcrypt.compare(password,user.password);

        if(!ismatch){
            return res.status(401).json('wrong password');
        }
        else{
            const token = jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET,{expiresIn:'7d'})
            return res.status(200).json({ token });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json('Something went wrong');
    }
}

module.exports = {register,login}