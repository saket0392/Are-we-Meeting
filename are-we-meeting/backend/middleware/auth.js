const jwt = require('jsonwebtoken')

function middleware(req,res,next) {
    try {
        const header = req.headers.authorization;
        if(header && header.startsWith('Bearer ')){
            const token = header.split(' ')[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = decoded;
            next();
        }else{
            return res.status(401).json('Invalid user');
        }
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' })
    }
}

module.exports = middleware;